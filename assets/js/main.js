(() => {
  "use strict";

  const config = window.ALITECHGRID_INTL_CONFIG || {};
  const placeholder = "PASTE_INTERNATIONAL_CONSULTATION_LIVE_LINK_HERE";
  const bookingReady =
    typeof config.consultationBookingUrl === "string" &&
    config.consultationBookingUrl.trim() &&
    config.consultationBookingUrl !== placeholder &&
    /^https:\/\//i.test(config.consultationBookingUrl);

  document.querySelectorAll("[data-consultation-link]").forEach((link) => {
    if (bookingReady) {
      link.href = config.consultationBookingUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.href = "contact.html";
    }
  });

  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const menuButton = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-main-nav]");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });
  }

  const form = document.querySelector("[data-email-request-form]");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(
        `Institutional inquiry: ${data.get("projectType") || "AliTechGrid International"}`
      );
      const body = encodeURIComponent(
`Name: ${data.get("name") || ""}
Institution/Company: ${data.get("organization") || ""}
Role: ${data.get("role") || ""}
Country/Region: ${data.get("country") || ""}
Project type: ${data.get("projectType") || ""}

Message:
${data.get("message") || ""}`
      );
      window.location.href = `mailto:${config.contactEmail || "contact@alitechgrid.com"}?subject=${subject}&body=${body}`;
    });
  }
})();
