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
  const itemsRoot = document.querySelector("[data-admin-items]");
  let sectionSelect = document.querySelector("[data-section-select], [name='section']");
  let arrivalCategoryField = document.querySelector("[data-arrival-category-field]");
  let arrivalCategorySelect = arrivalCategoryField?.querySelector("select");

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
    const clean = String(description || "").replace(/\s*\[laoban_stock:S=\d+,M=\d+,L=\d+,XL=\d+(?:,XXL=\d+)?\]\s*/g, "").trim();
    const stock = `[laoban_stock:S=${Number(values.stock_s)},M=${Number(values.stock_m)},L=${Number(values.stock_l)},XL=${Number(values.stock_xl)},XXL=${Number(values.stock_xxl)}]`;
    return clean ? `${clean}\n\n${stock}` : stock;
  }

  function productCodeFromDescription(description) {
    const match = String(description || "").match(/\[laoban_code:([A-Za-z0-9_-]+)\]/);
    return match ? match[1] : "";
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
      description: descriptionWithInventory(values.description, values),
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
    try {
      if (thumbnailFile?.size > 0) {
        uploadedThumbnail = await uploadCatalogFile(thumbnailFile, "thumbnail");
      }
      if (pdfFile?.size > 0) {
        uploadedPdf = await uploadCatalogFile(pdfFile, "pdf");
      }

      if (!files.length) {
        records.push(buildRecord(values, {
          thumbnailUrl: uploadedThumbnail?.publicUrl,
          thumbnailPath: uploadedThumbnail?.path,
          pdfUrl: uploadedPdf?.publicUrl,
          pdfPath: uploadedPdf?.path
        }));
      }

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const uploadedProduct = await uploadCatalogFile(file, "product");
        const thumbnailUrl = uploadedThumbnail?.publicUrl || uploadedProduct.publicUrl;
        const thumbnailPath = uploadedThumbnail?.path || uploadedProduct.path;
        records.push(buildRecord(values, {
          imageUrl: uploadedProduct.publicUrl,
          imagePath: uploadedProduct.path,
          thumbnailUrl,
          thumbnailPath,
          pdfUrl: uploadedPdf?.publicUrl,
          pdfPath: uploadedPdf?.path
        }, index, files.length));
      }
    } catch (error) {
      const uploadedPaths = [
        uploadedThumbnail?.path,
        uploadedPdf?.path,
        ...records.flatMap((record) => [record.storage_path, record.thumbnail_storage_path, record.pdf_storage_path])
      ].filter(Boolean);
      if (uploadedPaths.length) await client.storage.from("catalog").remove(uploadedPaths);
      throw error;
    }
    return records;
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
      const inventory = inventoryFromDescription(item.description);
      const stockText = inventory
        ? `S ${inventory.S} · M ${inventory.M} · L ${inventory.L} · XL ${inventory.XL} · XXL ${inventory.XXL}`
        : "Size stock not set";
      const code = item.product_code || productCodeFromDescription(item.description) || "No code";
      const colorName = Array.isArray(item.colors) && item.colors[0]?.name ? item.colors[0].name : "Color not set";
      const filtersText = `${item.product_type || "Product"} · ${item.fit || "Fit"} · ${colorName} · ${item.material || "Material"}${item.badge ? ` · ${item.badge}` : ""}${item.pdf_url ? " · PDF gallery" : ""}`;
      return `
      <article class="admin-item">
        <img src="${escapeHtml(item.thumbnail_url || item.image_url || "assets/white-tshirt.svg")}" alt="${escapeHtml(item.title)}">
        <div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(code)} · ${escapeHtml(filtersText)}</span><small>${stockText}</small></div>
        <button class="icon-button" type="button" data-delete-id="${escapeHtml(item.id)}" data-storage-path="${escapeHtml(item.storage_path)}" data-thumbnail-storage-path="${escapeHtml(item.thumbnail_storage_path)}" data-pdf-storage-path="${escapeHtml(item.pdf_storage_path)}" aria-label="Remove ${escapeHtml(item.title)}"><i data-lucide="trash-2"></i></button>
      </article>`;
    }).join("") || "<p>No uploaded products yet.</p>";
    window.lucide?.createIcons();
  }

  document.querySelectorAll("[data-admin-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-admin-mode]").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll("[data-admin-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.adminPanel !== button.dataset.adminMode;
      });
      if (button.dataset.adminMode === "remove") loadAdminItems();
    });
  });

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
    if (!files.length && !(pdfFile?.size > 0) && !(thumbnailFile?.size > 0)) {
      submitButton.disabled = false;
      return message(addMessage, "Upload a product PDF, a product photo, or a thumbnail.", "error");
    }
    message(addMessage, "Uploading product...");
    let records = [];
    try {
      records = await uploadFiles(files, values, thumbnailFile, pdfFile);
      const { error } = await client.from("catalog_items").insert(records);
      if (error) throw error;
      localStorage.setItem("laoban_catalog_updated_at", String(Date.now()));
      addForm.reset();
      updateArrivalCategoryField();
      message(addMessage, `${records.length} product${records.length === 1 ? "" : "s"} published successfully.`, "success");
    } catch (error) {
      const uploadedPaths = records.flatMap((record) => [record.storage_path, record.thumbnail_storage_path, record.pdf_storage_path]).filter(Boolean);
      if (uploadedPaths.length) await client.storage.from("catalog").remove(uploadedPaths);
      message(addMessage, error.message, "error");
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
