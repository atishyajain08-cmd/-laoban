(function () {
  const catalog = window.LaobanCatalog;
  const client = catalog?.client;
  const authSection = document.querySelector("[data-admin-auth]");
  const dashboard = document.querySelector("[data-admin-dashboard]");
  const setup = document.querySelector("[data-admin-setup]");
  const loginForm = document.querySelector("[data-login-form]");
  const loginMessage = document.querySelector("[data-login-message]");
  const resetPasswordButton = document.querySelector("[data-reset-password]");
  const googleLoginButton = document.querySelector("[data-google-login]");
  const addForm = document.querySelector("[data-add-form]");
  const addMessage = document.querySelector("[data-add-message]");
  const removeMessage = document.querySelector("[data-remove-message]");
  const ordersMessage = document.querySelector("[data-orders-message]");
  const itemsRoot = document.querySelector("[data-admin-items]");
  const ordersRoot = document.querySelector("[data-admin-orders]");
  let sectionSelect = document.querySelector("[data-section-select], [name='section']");
  let arrivalCategoryField = document.querySelector("[data-arrival-category-field]");
  let arrivalCategorySelect = arrivalCategoryField?.querySelector("select");
  let ordersInterval = null;

  function ensureUploadFields() {
    if (!addForm || !sectionSelect) return;
    sectionSelect.dataset.sectionSelect = "";

    if (!arrivalCategoryField) {
      arrivalCategoryField = document.createElement("label");
      arrivalCategoryField.dataset.arrivalCategoryField = "";
      arrivalCategoryField.innerHTML = `
        New Arrival subsection
        <select name="arrival_category" required>
          <option value="">Choose Casual, Workwear, or Evening</option>
          <option value="Casual">Casual</option>
          <option value="Workwear">Workwear</option>
          <option value="Evening">Evening</option>
        </select>`;
      sectionSelect.closest("label").insertAdjacentElement("afterend", arrivalCategoryField);
      arrivalCategorySelect = arrivalCategoryField.querySelector("select");
    }

    if (!addForm.querySelector(".admin-stock")) {
      const stock = document.createElement("fieldset");
      stock.className = "admin-stock";
      stock.innerHTML = `
        <legend>Product inventory by size</legend>
        <p class="admin-stock__note">Enter the number of pieces available in every size.</p>
        <label>S pieces<input type="number" name="stock_s" min="0" step="1" value="3" required></label>
        <label>M pieces<input type="number" name="stock_m" min="0" step="1" value="3" required></label>
        <label>L pieces<input type="number" name="stock_l" min="0" step="1" value="3" required></label>
        <label>XL pieces<input type="number" name="stock_xl" min="0" step="1" value="3" required></label>
        <label>XXL pieces<input type="number" name="stock_xxl" min="0" step="1" value="2" required></label>`;
      addForm.querySelector("input[type='file']")?.closest("label").insertAdjacentElement("beforebegin", stock);
    }
  }

  ensureUploadFields();

  function message(element, text, type = "") {
    if (!element) return;
    element.textContent = text;
    element.dataset.type = type;
  }

  function friendlyUploadError(error) {
    const text = error?.message || String(error || "");
    const missingColumn = text.match(/Could not find the '([^']+)' column of 'catalog_items'/i)?.[1];
    if (missingColumn) {
      return `Supabase database is missing the "${missingColumn}" column. Open Supabase SQL Editor, run supabase/repair-catalog-columns.sql, then upload again.`;
    }
    if (/schema cache/i.test(text)) {
      return `${text} Run supabase/repair-catalog-columns.sql in Supabase SQL Editor, then try again.`;
    }
    return text;
  }

  function isAdministrator(user) {
    return user?.app_metadata?.role === "admin";
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    })[character]);
  }

  function inventoryFromDescription(description) {
    const match = String(description || "").match(/\[laoban_stock:S=(\d+),M=(\d+),L=(\d+),XL=(\d+)(?:,XXL=(\d+))?\]/);
    return match ? { S: Number(match[1]), M: Number(match[2]), L: Number(match[3]), XL: Number(match[4]), XXL: Number(match[5] || 0) } : null;
  }

  function descriptionWithInventory(description, values) {
    const clean = String(description || "")
      .replace(/\s*\[laoban_stock:S=\d+,M=\d+,L=\d+,XL=\d+(?:,XXL=\d+)?\]\s*/g, "")
      .replace(/\s*\[laoban_meta:[^\]]+\]\s*/g, "")
      .trim();
    const stock = `[laoban_stock:S=${Number(values.stock_s)},M=${Number(values.stock_m)},L=${Number(values.stock_l)},XL=${Number(values.stock_xl)},XXL=${Number(values.stock_xxl)}]`;
    return clean ? `${clean}\n\n${stock}` : stock;
  }

  function descriptionWithMeta(description, values, asset, imageUrl, thumbnailUrl) {
    const meta = {
      product_code: String(values.product_code || "").trim().toUpperCase(),
      product_type: values.product_type || "T-Shirt",
      fit: values.fit || "Regular",
      material: values.material || "Cotton",
      colors: [{ name: values.color_name || "Pure White", hex: values.color_hex || "#FFFFFF" }],
      badge: values.badge || "",
      thumbnail_url: thumbnailUrl || "",
      thumbnail_storage_path: asset.thumbnailPath || asset.imagePath || "",
      pdf_url: asset.pdfUrl || "",
      pdf_storage_path: asset.pdfPath || "",
      image_url: imageUrl || "",
      gallery_urls: Array.isArray(asset.galleryUrls) ? asset.galleryUrls : [],
      gallery_storage_paths: Array.isArray(asset.galleryPaths) ? asset.galleryPaths : []
    };
    return `${descriptionWithInventory(description, values)}\n\n[laoban_meta:${encodeURIComponent(JSON.stringify(meta))}]`;
  }

  function productCodeFromDescription(description) {
    const match = String(description || "").match(/\[laoban_code:([A-Za-z0-9_-]+)\]/);
    return match ? match[1] : "";
  }

  function metaFromDescription(description) {
    const match = String(description || "").match(/\[laoban_meta:([^\]]+)\]/);
    if (!match) return {};
    try {
      return JSON.parse(decodeURIComponent(match[1]));
    } catch {
      return {};
    }
  }

  function showDashboard() {
    authSection.hidden = true;
    dashboard.hidden = false;
    window.lucide?.createIcons();
    loadAdminItems();
  }

  function showLogin() {
    authSection.hidden = false;
    dashboard.hidden = true;
  }

  async function currentSession() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    if (data.session && !isAdministrator(data.session.user)) {
      await client.auth.signOut();
      return null;
    }
    return data.session;
  }

  async function uploadCatalogFile(file, prefix = "product") {
    const extension = file.name.split(".").pop().toLowerCase();
    const path = `${prefix}-${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await client.storage.from("catalog").upload(path, file, {
      cacheControl: "3600",
      upsert: false
    });
    if (uploadError) throw uploadError;
    const { data: publicData } = client.storage.from("catalog").getPublicUrl(path);
    return { path, publicUrl: publicData.publicUrl };
  }

  function buildRecord(values, asset, index = 0, total = 1) {
    const imageUrl = asset.imageUrl || asset.thumbnailUrl || "assets/products/basic-white-tee.svg";
    const thumbnailUrl = asset.thumbnailUrl || imageUrl;
    return {
      product_code: String(values.product_code || "").trim().toUpperCase(),
      title: total > 1 ? `${values.title} ${index + 1}` : values.title,
      description: descriptionWithMeta(values.description, values, asset, imageUrl, thumbnailUrl),
      price: Number(values.price || 0),
      product_type: values.product_type || "T-Shirt",
      fit: values.fit || "Regular",
      material: values.material || "Cotton",
      colors: [{ name: values.color_name || "Pure White", hex: values.color_hex || "#FFFFFF" }],
      badge: values.badge || null,
      section: values.section,
      label: values.section === "new-arrivals"
        ? values.arrival_category
        : values.section === "lookbook" ? "Lookbook" : values.section === "product" ? "Product" : "Collection",
      thumbnail_url: thumbnailUrl,
      thumbnail_storage_path: asset.thumbnailPath || asset.imagePath || null,
      pdf_url: asset.pdfUrl || null,
      pdf_storage_path: asset.pdfPath || null,
      gallery_urls: Array.isArray(asset.galleryUrls) ? asset.galleryUrls : [],
      image_url: imageUrl,
      storage_path: asset.imagePath || null,
      is_active: true,
      sort_order: index + 1
    };
  }

  async function uploadFiles(files, values, thumbnailFile, pdfFile) {
    const records = [];
    let uploadedThumbnail = null;
    let uploadedPdf = null;
    const uploadedProducts = [];
    try {
      if (thumbnailFile?.size > 0) {
        uploadedThumbnail = await uploadCatalogFile(thumbnailFile, "thumbnail");
      }
      if (pdfFile?.size > 0) {
        uploadedPdf = await uploadCatalogFile(pdfFile, "pdf");
      }

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const uploadedProduct = await uploadCatalogFile(file, "product");
        uploadedProducts.push(uploadedProduct);
      }

      const primaryProduct = uploadedProducts[0];
      records.push(buildRecord(values, {
        imageUrl: primaryProduct?.publicUrl,
        imagePath: primaryProduct?.path,
        thumbnailUrl: uploadedThumbnail?.publicUrl || primaryProduct?.publicUrl,
        thumbnailPath: uploadedThumbnail?.path || primaryProduct?.path,
        pdfUrl: uploadedPdf?.publicUrl,
        pdfPath: uploadedPdf?.path,
        galleryUrls: uploadedProducts.map((item) => item.publicUrl),
        galleryPaths: uploadedProducts.map((item) => item.path)
      }));
    } catch (error) {
      const uploadedPaths = [
        uploadedThumbnail?.path,
        uploadedPdf?.path,
        ...uploadedProducts.map((item) => item.path),
        ...records.flatMap((record) => [record.storage_path, record.thumbnail_storage_path, record.pdf_storage_path])
      ].filter(Boolean);
      if (uploadedPaths.length) await client.storage.from("catalog").remove(uploadedPaths);
      throw error;
    }
    return records;
  }

  function missingCatalogColumn(error) {
    const text = error?.message || String(error || "");
    return text.match(/Could not find the '([^']+)' column of 'catalog_items'/i)?.[1] || "";
  }

  async function insertCatalogRecords(records) {
    let payload = records.map((record) => ({ ...record }));
    const strippedColumns = [];
    for (let attempt = 0; attempt < 16; attempt += 1) {
      const { error } = await client.from("catalog_items").insert(payload);
      if (!error) return strippedColumns;

      const missingColumn = missingCatalogColumn(error);
      if (!missingColumn) throw error;

      strippedColumns.push(missingColumn);
      payload = payload.map((record) => {
        const next = { ...record };
        delete next[missingColumn];
        return next;
      });
    }
    throw new Error("Supabase catalog schema is missing too many columns. Please run supabase/repair-catalog-columns.sql.");
  }

  async function loadAdminItems() {
    if (!client || !itemsRoot) return;
    itemsRoot.innerHTML = "<p>Loading catalog...</p>";
    const { data, error } = await client.from("catalog_items").select("*").order("created_at", { ascending: false });
    if (error) {
      itemsRoot.innerHTML = "";
      message(removeMessage, error.message, "error");
      return;
    }
    itemsRoot.innerHTML = (data || []).map((item) => {
      const meta = metaFromDescription(item.description);
      const inventory = inventoryFromDescription(item.description);
      const stockText = inventory
        ? `S ${inventory.S} · M ${inventory.M} · L ${inventory.L} · XL ${inventory.XL} · XXL ${inventory.XXL}`
        : "Size stock not set";
      const code = item.product_code || meta.product_code || productCodeFromDescription(item.description) || "No code";
      const colors = Array.isArray(item.colors) ? item.colors : meta.colors;
      const colorName = Array.isArray(colors) && colors[0]?.name ? colors[0].name : "Color not set";
      const pdfUrl = item.pdf_url || meta.pdf_url;
      const filtersText = `${item.product_type || meta.product_type || "Product"} · ${item.fit || meta.fit || "Fit"} · ${colorName} · ${item.material || meta.material || "Material"}${item.badge || meta.badge ? ` · ${item.badge || meta.badge}` : ""}${pdfUrl ? " · PDF gallery" : ""}`;
      return `
      <article class="admin-item">
        <img src="${escapeHtml(item.thumbnail_url || meta.thumbnail_url || item.image_url || meta.image_url || "assets/white-tshirt.svg")}" alt="${escapeHtml(item.title)}">
        <div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(code)} · ${escapeHtml(filtersText)}</span><small>${stockText}</small></div>
        <button class="icon-button" type="button" data-delete-id="${escapeHtml(item.id)}" data-storage-path="${escapeHtml(item.storage_path)}" data-thumbnail-storage-path="${escapeHtml(item.thumbnail_storage_path)}" data-pdf-storage-path="${escapeHtml(item.pdf_storage_path)}" aria-label="Remove ${escapeHtml(item.title)}"><i data-lucide="trash-2"></i></button>
      </article>`;
    }).join("") || "<p>No uploaded products yet.</p>";
    window.lucide?.createIcons();
  }

  function formatPrice(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  }

  async function loadOrders() {
    if (!client || !ordersRoot) return;
    ordersRoot.innerHTML = "<p>Loading orders...</p>";
    message(ordersMessage, "");
    const { data, error } = await client.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) {
      ordersRoot.innerHTML = "";
      return message(ordersMessage, `${error.message}. If this is the first time, run supabase/schema.sql or repair-catalog-columns.sql in Supabase SQL Editor.`, "error");
    }
    ordersRoot.innerHTML = (data || []).map((order) => {
      const address = order.shipping_address || {};
      const items = Array.isArray(order.items) ? order.items : [];
      const itemText = items.map((item) => `${item.name} (${item.size || "-"} / ${item.color || "-"}) × ${item.quantity || 1}`).join(" · ");
      const deliveryLines = [
        address.house_number || address.houseNumber || "",
        address.street || address.address || "",
        address.landmark ? `Landmark: ${address.landmark}` : "",
        [address.city, address.state].filter(Boolean).join(", "),
        address.pincode ? `PIN: ${address.pincode}` : "",
        address.country || "India",
      ].filter(Boolean);
      return `
        <article class="admin-item admin-order-card">
          <div>
            <strong>${escapeHtml(order.order_code)}</strong>
            <span>${escapeHtml(order.status || "Processing")} · ${escapeHtml(order.payment_method || "COD")} · ${formatPrice(order.total)}</span>
            <p><code>${escapeHtml(order.customer_name)}</code> · ${escapeHtml(order.customer_phone)} · ${escapeHtml(order.customer_email)}</p>
            <p>${deliveryLines.map(escapeHtml).join("<br>")}</p>
            <small>${escapeHtml(itemText || "No item data")}</small>
          </div>
          <small>${new Date(order.created_at).toLocaleString("en-IN")}</small>
        </article>`;
    }).join("") || "<p>No orders yet.</p>";
    message(ordersMessage, `Showing ${(data || []).length} live Supabase order${(data || []).length === 1 ? "" : "s"}. Auto-refresh is on.`, "success");
  }

  document.querySelectorAll("[data-admin-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-admin-mode]").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll("[data-admin-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.adminPanel !== button.dataset.adminMode;
      });
      if (button.dataset.adminMode === "remove") loadAdminItems();
      if (button.dataset.adminMode === "orders") {
        loadOrders();
        if (!ordersInterval) ordersInterval = setInterval(loadOrders, 10000);
      } else if (ordersInterval) {
        clearInterval(ordersInterval);
        ordersInterval = null;
      }
    });
  });

  document.querySelector("[data-refresh-orders]")?.addEventListener("click", loadOrders);

  function updateArrivalCategoryField() {
    const isNewArrival = sectionSelect?.value === "new-arrivals";
    if (arrivalCategoryField) arrivalCategoryField.hidden = !isNewArrival;
    if (arrivalCategorySelect) {
      arrivalCategorySelect.required = isNewArrival;
      arrivalCategorySelect.disabled = !isNewArrival;
      if (!isNewArrival) arrivalCategorySelect.value = "";
    }
  }

  sectionSelect?.addEventListener("change", updateArrivalCategoryField);

  resetPasswordButton?.addEventListener("click", async () => {
    if (!client || !loginForm) return;
    const email = String(new FormData(loginForm).get("email") || "").trim();
    if (!email) {
      message(loginMessage, "Enter your admin email first, then click reset.", "error");
      return;
    }

    resetPasswordButton.disabled = true;
    message(loginMessage, "Sending password reset email...");

    try {
      const redirectTo = new URL("reset-password.html", window.location.href).toString();
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      message(loginMessage, "Password reset email sent. Open the newest email and set a new password.", "success");
    } catch (error) {
      message(loginMessage, error.message || "Could not send password reset email.", "error");
    } finally {
      resetPasswordButton.disabled = false;
    }
  });

  googleLoginButton?.addEventListener("click", async () => {
    if (!client) return;
    googleLoginButton.disabled = true;
    message(loginMessage, "Opening Google sign in...");

    try {
      const redirectTo = new URL("admin.html", window.location.href).toString();
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { prompt: "select_account" }
        }
      });
      if (error) throw error;
    } catch (error) {
      googleLoginButton.disabled = false;
      message(loginMessage, error.message || "Could not open Google sign in.", "error");
    }
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!client) return;
    const submitButton = loginForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    message(loginMessage, "Signing in...");
    const values = Object.fromEntries(new FormData(loginForm));
    try {
      const result = await Promise.race([
        client.auth.signInWithPassword({ email: values.email.trim(), password: values.password }),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Sign-in took too long. Close other Laoban Admin tabs, refresh this page, and try again.")), 12000);
        })
      ]);
      if (result.error) throw result.error;
      if (!isAdministrator(result.data.user)) {
        await client.auth.signOut();
        throw new Error("This account does not have administrator access.");
      }
      message(loginMessage, "");
      showDashboard();
    } catch (error) {
      message(loginMessage, error.message || "Could not sign in. Please try again.", "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  addForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!client) return;
    const formData = new FormData(addForm);
    const files = formData.getAll("photos").filter((file) => file.size > 0);
    const thumbnailFile = formData.get("thumbnail");
    const pdfFile = formData.get("product_pdf");
    const values = Object.fromEntries(formData);
    const submitButton = addForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    if (!String(values.product_code || "").trim()) {
      submitButton.disabled = false;
      return message(addMessage, "Product code is required.", "error");
    }
    if (!String(values.title || "").trim()) {
      submitButton.disabled = false;
      return message(addMessage, "Product name is required.", "error");
    }
    if (Number(values.price || 0) <= 0) {
      submitButton.disabled = false;
      return message(addMessage, "Enter a valid price greater than zero.", "error");
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(String(values.color_hex || ""))) {
      submitButton.disabled = false;
      return message(addMessage, "Enter a valid color hex code like #FFFFFF.", "error");
    }
    if (!files.length && !(pdfFile?.size > 0) && !(thumbnailFile?.size > 0)) {
      submitButton.disabled = false;
      return message(addMessage, "Upload a product PDF, a product photo, or a thumbnail.", "error");
    }
    if (pdfFile?.size > 0 && !(thumbnailFile?.size > 0) && !files.length) {
      submitButton.disabled = false;
      return message(addMessage, "Upload a frontend thumbnail photo also. The PDF is the gallery; the thumbnail is what customers see first.", "error");
    }
    message(addMessage, "Uploading product...");
    let records = [];
    try {
      records = await uploadFiles(files, values, thumbnailFile, pdfFile);
      const strippedColumns = await insertCatalogRecords(records);
      localStorage.setItem("laoban_catalog_updated_at", String(Date.now()));
      addForm.reset();
      updateArrivalCategoryField();
      const fallbackNote = strippedColumns.length
        ? ` Missing Supabase columns were bypassed: ${Array.from(new Set(strippedColumns)).join(", ")}.`
        : "";
      message(addMessage, `${records.length} product${records.length === 1 ? "" : "s"} published successfully.${fallbackNote}`, "success");
    } catch (error) {
      const uploadedPaths = records.flatMap((record) => [record.storage_path, record.thumbnail_storage_path, record.pdf_storage_path]).filter(Boolean);
      if (uploadedPaths.length) await client.storage.from("catalog").remove(uploadedPaths);
      message(addMessage, friendlyUploadError(error), "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  itemsRoot?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-id]");
    if (!button || !client) return;
    button.disabled = true;
    message(removeMessage, "Removing product...");
    const { error } = await client.from("catalog_items").delete().eq("id", button.dataset.deleteId);
    if (error) {
      button.disabled = false;
      return message(removeMessage, error.message, "error");
    }
    const pathsToRemove = [button.dataset.storagePath, button.dataset.thumbnailStoragePath, button.dataset.pdfStoragePath]
      .filter(Boolean)
      .filter((path, index, all) => all.indexOf(path) === index);
    if (pathsToRemove.length) {
      await client.storage.from("catalog").remove(pathsToRemove);
    }
    localStorage.setItem("laoban_catalog_updated_at", String(Date.now()));
    message(removeMessage, "Product removed.", "success");
    loadAdminItems();
  });

  document.querySelector("[data-sign-out]")?.addEventListener("click", async () => {
    await client?.auth.signOut();
    showLogin();
  });

  document.addEventListener("DOMContentLoaded", async () => {
    ensureUploadFields();
    sectionSelect = document.querySelector("[data-section-select], [name='section']");
    arrivalCategoryField = document.querySelector("[data-arrival-category-field]");
    arrivalCategorySelect = arrivalCategoryField?.querySelector("select");
    updateArrivalCategoryField();
    if (!catalog?.isConfigured) {
      setup.hidden = false;
      loginForm.querySelectorAll("input, button").forEach((element) => { element.disabled = true; });
      return;
    }
    if (await currentSession()) showDashboard();
  });
})();
