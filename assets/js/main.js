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

  const nav = document.querySelector("[data-main-nav]");
  if (nav) {
    const trainingLink = nav.querySelector('a[href="education.html"]');
    if (trainingLink) trainingLink.textContent = "Training";

    // Request Proposal is the single primary header action, not an extra nav item.
    nav.querySelectorAll('a[href="proposal.html"]').forEach((link) => link.remove());
  }

  const headerCta = document.querySelector(".header-cta");
  if (headerCta) {
    headerCta.removeAttribute("data-consultation-link");
    headerCta.href = "proposal.html";
    headerCta.target = "";
    headerCta.rel = "";
    headerCta.textContent = "Request Proposal";
  }

  const path = window.location.pathname.toLowerCase();
  if (path.endsWith("/") || path.endsWith("/index.html")) {
    const actions = document.querySelector(".hero-actions");
    if (actions && !actions.querySelector('a[href="education.html"]')) {
      const training = document.createElement("a");
      training.className = "button button-secondary";
      training.href = "education.html";
      training.textContent = "Explore AI, Sovereign AI & Cloud Training";
      actions.appendChild(training);
    }
  }

  const menuButton = document.querySelector("[data-menu-button]");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });
  }

  const form = document.querySelector("[data-email-request-form]");
  if (form) {
    const projectType = form.querySelector('select[name="projectType"]');
    if (projectType && !Array.from(projectType.options).some(
      (option) => option.value === "AI, sovereign AI and cloud training proposal"
    )) {
      const option = document.createElement("option");
      option.value = "AI, sovereign AI and cloud training proposal";
      option.textContent = "AI, sovereign AI and cloud training proposal";
      projectType.insertBefore(option, projectType.firstChild);
    }

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
