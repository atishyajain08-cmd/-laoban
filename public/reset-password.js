(function () {
  const config = window.LAOBAN_SUPABASE || {};
  const isConfigured = Boolean(config.url && config.anonKey && window.supabase);
  const client = isConfigured ? window.supabase.createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "laoban-password-reset"
    }
  }) : null;

  const form = document.querySelector("[data-reset-form]");
  const message = document.querySelector("[data-reset-message]");
  const ready = document.querySelector("[data-reset-ready]");

  function setMessage(node, text, type) {
    if (!node) return;
    node.textContent = text;
    node.dataset.type = type || "";
  }

  async function waitForRecoverySession() {
    if (!client) {
      setMessage(ready, "Backend connection is missing. Check Supabase config.", "error");
      form.hidden = true;
      return;
    }

    const hasRecoveryHash = location.hash.includes("type=recovery") || location.search.includes("type=recovery");

    const { data } = await client.auth.getSession();
    if (data?.session) {
      setMessage(ready, "Recovery link verified. Enter a new password.", "success");
      form.hidden = false;
      return;
    }

    form.hidden = true;
    setMessage(
      ready,
      hasRecoveryHash
        ? "Recovery link is loading. If this does not change in a few seconds, request a fresh password recovery email."
        : "Open this page from the newest Supabase password recovery email.",
      hasRecoveryHash ? "" : "error"
    );
  }

  client?.auth.onAuthStateChange((event, session) => {
    if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
      setMessage(ready, "Recovery link verified. Enter a new password.", "success");
      form.hidden = false;
    }
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!client) return;

    const submitButton = form.querySelector("button[type='submit']");
    const values = Object.fromEntries(new FormData(form));
    const password = String(values.password || "");
    const confirmPassword = String(values.confirmPassword || "");

    if (password.length < 6) {
      setMessage(message, "Password must be at least 6 characters.", "error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage(message, "Passwords do not match.", "error");
      return;
    }

    submitButton.disabled = true;
    setMessage(message, "Updating password...");

    try {
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;
      await client.auth.signOut();
      setMessage(message, "Password updated. You can now sign in to Laoban Admin.", "success");
      window.setTimeout(() => {
        window.location.href = "admin.html";
      }, 1400);
    } catch (error) {
      setMessage(message, error.message || "Could not update password. Request a fresh recovery email.", "error");
    } finally {
      submitButton.disabled = false;
    }
  });

  waitForRecoverySession();
})();
