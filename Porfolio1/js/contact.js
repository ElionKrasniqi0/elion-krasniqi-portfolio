/**
 * Contact form — validation + integration-ready submit
 *
 * INTEGRATION POINT:
 * Replace the body of `submitContact()` with a real POST to your backend, e.g.:
 *   POST /api/contact
 *   { name, email, message }
 */

export async function submitContact(payload) {
  // --- Backend integration hook ---
  // Example production implementation:
  //
  // const res = await fetch("/api/contact", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json", Accept: "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Failed to send message");
  // return res.json();
  //
  // Until a backend exists, we simulate a successful handoff locally.

  await new Promise((r) => setTimeout(r, 700));

  // Persist draft payload for future backend wiring / debugging
  try {
    sessionStorage.setItem("devsys-contact-draft", JSON.stringify({
      ...payload,
      queuedAt: new Date().toISOString(),
      endpoint: "/api/contact",
    }));
  } catch {
    /* ignore storage errors */
  }

  return { ok: true, queued: true };
}

export function initContact() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  const submitBtn = document.getElementById("contact-submit");
  const label = submitBtn?.querySelector("[data-submit-label]");
  if (!form) return;

  const fields = {
    name: form.querySelector("#contact-name"),
    email: form.querySelector("#contact-email"),
    message: form.querySelector("#contact-message"),
  };

  function setError(name, message) {
    const field = fields[name]?.closest(".field");
    const err = form.querySelector(`[data-error-for="${name}"]`);
    if (!field || !err) return;
    if (message) {
      field.classList.add("is-invalid");
      err.hidden = false;
      err.textContent = message;
    } else {
      field.classList.remove("is-invalid");
      err.hidden = true;
      err.textContent = "";
    }
  }

  function validate() {
    let ok = true;
    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const message = fields.message.value.trim();

    if (name.length < 2) {
      setError("name", "Please enter your name.");
      ok = false;
    } else setError("name", "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", "Enter a valid email address.");
      ok = false;
    } else setError("email", "");

    if (message.length < 10) {
      setError("message", "Message should be at least 10 characters.");
      ok = false;
    } else setError("message", "");

    return ok ? { name, email, message } : null;
  }

  Object.values(fields).forEach((input) => {
    input?.addEventListener("input", () => {
      setError(input.name, "");
      if (status) {
        status.textContent = "";
        status.className = "contact__note";
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = validate();
    if (!payload) {
      if (status) {
        status.textContent = "Check the highlighted fields.";
        status.className = "contact__note is-error";
      }
      return;
    }

    form.classList.add("is-loading");
    if (label) label.textContent = "Transmitting…";
    if (status) {
      status.textContent = "Queuing message for /api/contact…";
      status.className = "contact__note";
    }

    try {
      await submitContact(payload);
      form.reset();
      if (status) {
        status.textContent =
          "Message queued locally. Connect POST /api/contact to deliver emails.";
        status.className = "contact__note is-success";
      }
    } catch {
      if (status) {
        status.textContent = "Unable to queue message. Try email directly.";
        status.className = "contact__note is-error";
      }
    } finally {
      form.classList.remove("is-loading");
      if (label) label.textContent = "Transmit Message";
    }
  });

  // Copy email
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(value);
        const prev = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.textContent = prev;
        }, 1400);
      } catch {
        window.location.href = `mailto:${value}`;
      }
    });
  });
}
