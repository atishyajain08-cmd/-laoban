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
  let adminItemsCache = new Map();
  let editingItemId = null;
  let editingItem = null;
  let cancelEditButton = null;

  // Only store a colour when the admin actually typed one; if no hex was
  // given, the colour NAME doubles as the swatch (CSS names: red, navy, ...).
  function colorEntry(values) {
    const name = String(values.color_name || "").trim();
    if (!name) return [];
    const hex = /^#[0-9A-Fa-f]{6}$/.test(String(values.color_hex || "").trim())
      ? String(values.color_hex).trim()
      : name.toLowerCase();
    return [{ name, hex }];
  }

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

    if (!addForm.querySelector("[data-cancel-edit]")) {
      const submitButton = addForm.querySelector("button[type='submit']");
      cancelEditButton = document.createElement("button");
      cancelEditButton.type = "button";
      cancelEditButton.dataset.cancelEdit = "";
      cancelEditButton.hidden = true;
      cancelEditButton.textContent = "Cancel editing";
      cancelEditButton.className = submitButton?.className || "";
      submitButton?.insertAdjacentElement("afterend", cancelEditButton);
      cancelEditButton.addEventListener("click", () => {
        addForm.reset();
        updateArrivalCategoryField();
        exitEditMode();
        message(addMessage, "Edit cancelled.");
      });
    } else {
      cancelEditButton = addForm.querySelector("[data-cancel-edit]");
    }
  }

  function exitEditMode() {
    editingItemId = null;
    editingItem = null;
    const submitButton = addForm?.querySelector("button[type='submit']");
    if (submitButton?.dataset.originalText) submitButton.textContent = submitButton.dataset.originalText;
    if (cancelEditButton) cancelEditButton.hidden = true;
  }

  function setFormValue(name, value) {
    const field = addForm?.elements?.[name];
    if (field) field.value = value ?? "";
  }

  function startEditItem(item) {
    if (!addForm) return;
    const meta = metaFromDescription(item.description);
    const inventory = inventoryFromDescription(item.description) || { S: 3, M: 3, L: 3, XL: 3, XXL: 2 };
    const colors = (Array.isArray(item.colors) && item.colors.length ? item.colors : meta.colors) || [];
    const cleanDesc = String(item.description || "")
      .replace(/\s*\[laoban_stock:S=\d+,M=\d+,L=\d+,XL=\d+(?:,XXL=\d+)?\]\s*/g, "")
      .replace(/\s*\[laoban_meta:[^\]]+\]\s*/g, "")
      .trim();

    editingItemId = item.id;
    editingItem = item;

    setFormValue("product_code", item.product_code || meta.product_code || "");
    setFormValue("title", item.title || "");
    setFormValue("description", cleanDesc);
    setFormValue("price", item.price || 0);
    setFormValue("product_type", item.product_type || meta.product_type || "T-Shirt");
    setFormValue("fit", item.fit || meta.fit || "Regular");
    setFormValue("material", item.material || meta.material || "Cotton");
    setFormValue("color_name", colors[0]?.name || "");
    setFormValue("color_hex", /^#[0-9A-Fa-f]{6}$/.test(colors[0]?.hex || "") ? colors[0].hex : "");
    setFormValue("badge", item.badge || meta.badge || "");
    setFormValue("section", item.section || "product");
    updateArrivalCategoryField();
    if (sectionSelect?.value === "new-arrivals") setFormValue("arrival_category", item.label || "");
    setFormValue("stock_s", inventory.S);
    setFormValue("stock_m", inventory.M);
    setFormValue("stock_l", inventory.L);
    setFormValue("stock_xl", inventory.XL);
    setFormValue("stock_xxl", inventory.XXL);

    const submitButton = addForm.querySelector("button[type='submit']");
    if (submitButton) {
      if (!submitButton.dataset.originalText) submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = "Update product";
    }
    if (cancelEditButton) cancelEditButton.hidden = false;

    document.querySelector("[data-admin-mode='add']")?.click();
    addForm.scrollIntoView({ behavior: "smooth", block: "start" });
    message(addMessage, `Editing "${item.title}". Change any details and press Update product. Leave the file fields empty to keep the current photos and PDF.`);
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

  function urlPath(url) {
    if (!url) return "";
    try {
      return new URL(url, window.location.href).pathname.toLowerCase();
    } catch {
      return String(url || "").toLowerCase().split("?")[0];
    }
  }

  function isPdfUrl(url) {
    return urlPath(url).endsWith(".pdf");
  }

  function isImageUrl(url) {
    return /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(urlPath(url));
  }

  function firstImageUrl(candidates) {
    return candidates.filter(Boolean).find((url) => !isPdfUrl(url) && isImageUrl(url)) || "assets/products/basic-white-tee.svg";
  }

  function firstPdfUrl(candidates) {
    return candidates.filter(Boolean).find((url) => isPdfUrl(url)) || "";
  }

  function hasMime(file, prefix) {
    return Boolean(file?.size > 0 && String(file.type || "").startsWith(prefix));
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
      colors: colorEntry(values),
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
      colors: colorEntry(values),
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

  async function updateCatalogRecord(id, record) {
    const payload = { ...record };
    delete payload.sort_order; // keep the item's existing position
    const strippedColumns = [];
    for (let attempt = 0; attempt < 16; attempt += 1) {
      const { error } = await client.from("catalog_items").update(payload).eq("id", id);
      if (!error) return strippedColumns;

      const missingColumn = missingCatalogColumn(error);
      if (!missingColumn) throw error;

      strippedColumns.push(missingColumn);
      delete payload[missingColumn];
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
    adminItemsCache = new Map((data || []).map((row) => [String(row.id), row]));
    itemsRoot.innerHTML = (data || []).map((item) => {
      const meta = metaFromDescription(item.description);
      const inventory = inventoryFromDescription(item.description);
      const stockText = inventory
        ? `S ${inventory.S} · M ${inventory.M} · L ${inventory.L} · XL ${inventory.XL} · XXL ${inventory.XXL}`
        : "Size stock not set";
      const code = item.product_code || meta.product_code || productCodeFromDescription(item.description) || "No code";
      const colors = Array.isArray(item.colors) ? item.colors : meta.colors;
      const colorName = Array.isArray(colors) && colors[0]?.name ? colors[0].name : "Color not set";
      const mediaCandidates = [
        item.thumbnail_url || meta.thumbnail_url,
        item.image_url || meta.image_url,
        item.pdf_url || meta.pdf_url,
        ...(Array.isArray(item.gallery_urls) ? item.gallery_urls : []),
        ...(Array.isArray(meta.gallery_urls) ? meta.gallery_urls : [])
      ];
      const thumbnailUrl = firstImageUrl(mediaCandidates);
      const pdfUrl = firstPdfUrl(mediaCandidates);
      const filtersText = `${item.product_type || meta.product_type || "Product"} · ${item.fit || meta.fit || "Fit"} · ${colorName} · ${item.material || meta.material || "Material"}${item.badge || meta.badge ? ` · ${item.badge || meta.badge}` : ""}${pdfUrl ? " · PDF gallery" : ""}`;
      return `
      <article class="admin-item">
        <img src="${escapeHtml(thumbnailUrl)}" alt="${escapeHtml(item.title)}">
        <div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(code)} · ${escapeHtml(filtersText)}</span><small>${stockText}</small></div>
        <button class="icon-button" type="button" data-edit-id="${escapeHtml(item.id)}" aria-label="Edit ${escapeHtml(item.title)}"><i data-lucide="pencil"></i></button>
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
      let legacy = {};
      if (order.address && typeof order.address === "string") {
        try {
          legacy = JSON.parse(order.address);
        } catch {
          legacy = { shipping_address: { address: order.address } };
        }
      } else if (order.address && typeof order.address === "object") {
        legacy = order.address;
      }
      const address = order.shipping_address || legacy.shipping_address || {};
      const items = Array.isArray(order.items) ? order.items : Array.isArray(legacy.items) ? legacy.items : [];
      const customer = legacy.customer || {};
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
            <strong>${escapeHtml(order.order_code || legacy.order_code || order.id)}</strong>
            <span>${escapeHtml(order.status || "Processing")} · ${escapeHtml(order.payment_method || "COD")} · ${formatPrice(order.total)}</span>
            <p><code>${escapeHtml(order.customer_name || order.full_name || customer.name)}</code> · ${escapeHtml(order.customer_phone || order.phone || customer.phone)} · ${escapeHtml(order.customer_email || order.email || customer.email)}</p>
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
    if (!String(values.color_name || "").trim()) {
      submitButton.disabled = false;
      return message(addMessage, "Enter the product's real color name, e.g. Red, Navy, Black.", "error");
    }
    if (String(values.color_hex || "").trim() && !/^#[0-9A-Fa-f]{6}$/.test(String(values.color_hex).trim())) {
      submitButton.disabled = false;
      return message(addMessage, "Color hex must look like #C41E1E — or leave it empty to use the color name.", "error");
    }
    if (!editingItemId && !files.length && !(pdfFile?.size > 0) && !(thumbnailFile?.size > 0)) {
      submitButton.disabled = false;
      return message(addMessage, "Upload a product PDF, a product photo, or a thumbnail.", "error");
    }
    if (thumbnailFile?.size > 0 && !hasMime(thumbnailFile, "image/")) {
      submitButton.disabled = false;
      return message(addMessage, "The frontend thumbnail must be a JPG, PNG, or WebP image. Do not upload the PDF in the thumbnail field.", "error");
    }
    if (pdfFile?.size > 0 && pdfFile.type !== "application/pdf" && !String(pdfFile.name || "").toLowerCase().endsWith(".pdf")) {
      submitButton.disabled = false;
      return message(addMessage, "The PDF gallery field must contain the product PDF, not a JPG thumbnail.", "error");
    }
    if (files.some((file) => !hasMime(file, "image/"))) {
      submitButton.disabled = false;
      return message(addMessage, "Extra product photos must be image files only.", "error");
    }
    if (!editingItemId && pdfFile?.size > 0 && !(thumbnailFile?.size > 0) && !files.length) {
      submitButton.disabled = false;
      return message(addMessage, "Upload a frontend thumbnail photo also. The PDF is the gallery; the thumbnail is what customers see first.", "error");
    }

    // EDIT MODE: update the existing row, keeping current media unless replaced.
    if (editingItemId && editingItem) {
      message(addMessage, "Updating product...");
      try {
        const existingMeta = metaFromDescription(editingItem.description);
        let uploadedThumbnail = null;
        let uploadedPdf = null;
        const uploadedProducts = [];
        if (thumbnailFile?.size > 0) uploadedThumbnail = await uploadCatalogFile(thumbnailFile, "thumbnail");
        if (pdfFile?.size > 0) uploadedPdf = await uploadCatalogFile(pdfFile, "pdf");
        for (const file of files) uploadedProducts.push(await uploadCatalogFile(file, "product"));

        const existingGalleryUrls = Array.isArray(editingItem.gallery_urls) && editingItem.gallery_urls.length
          ? editingItem.gallery_urls
          : Array.isArray(existingMeta.gallery_urls) ? existingMeta.gallery_urls : [];
        const existingGalleryPaths = Array.isArray(existingMeta.gallery_storage_paths) ? existingMeta.gallery_storage_paths : [];

        const asset = {
          imageUrl: uploadedProducts[0]?.publicUrl || editingItem.image_url || existingMeta.image_url,
          imagePath: uploadedProducts[0]?.path || editingItem.storage_path || null,
          thumbnailUrl: uploadedThumbnail?.publicUrl || editingItem.thumbnail_url || existingMeta.thumbnail_url || uploadedProducts[0]?.publicUrl,
          thumbnailPath: uploadedThumbnail?.path || editingItem.thumbnail_storage_path || existingMeta.thumbnail_storage_path || null,
          pdfUrl: uploadedPdf?.publicUrl || editingItem.pdf_url || existingMeta.pdf_url || "",
          pdfPath: uploadedPdf?.path || editingItem.pdf_storage_path || existingMeta.pdf_storage_path || null,
          galleryUrls: uploadedProducts.length ? uploadedProducts.map((u) => u.publicUrl) : existingGalleryUrls,
          galleryPaths: uploadedProducts.length ? uploadedProducts.map((u) => u.path) : existingGalleryPaths
        };
        const record = buildRecord(values, asset);
        const strippedColumns = await updateCatalogRecord(editingItemId, record);
        localStorage.setItem("laoban_catalog_updated_at", String(Date.now()));
        addForm.reset();
        updateArrivalCategoryField();
        exitEditMode();
        const fallbackNote = strippedColumns.length
          ? ` Missing Supabase columns were bypassed: ${Array.from(new Set(strippedColumns)).join(", ")}.`
          : "";
        message(addMessage, `Product updated successfully.${fallbackNote}`, "success");
        loadAdminItems();
      } catch (error) {
        message(addMessage, friendlyUploadError(error), "error");
      } finally {
        submitButton.disabled = false;
      }
      return;
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
      const pdfSizeNote = pdfFile?.size > 8 * 1024 * 1024
        ? ` Note: the PDF is ${(pdfFile.size / (1024 * 1024)).toFixed(1)} MB — its gallery will load slowly for customers. Compress it under 5 MB for a faster page.`
        : "";
      message(addMessage, `${records.length} product${records.length === 1 ? "" : "s"} published successfully.${fallbackNote}${pdfSizeNote}`, "success");
    } catch (error) {
      const uploadedPaths = records.flatMap((record) => [record.storage_path, record.thumbnail_storage_path, record.pdf_storage_path]).filter(Boolean);
      if (uploadedPaths.length) await client.storage.from("catalog").remove(uploadedPaths);
      message(addMessage, friendlyUploadError(error), "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  itemsRoot?.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-id]");
    if (editButton) {
      const item = adminItemsCache.get(String(editButton.dataset.editId));
      if (item) startEditItem(item);
      else message(removeMessage, "Could not load this product for editing. Refresh and try again.", "error");
      return;
    }
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
