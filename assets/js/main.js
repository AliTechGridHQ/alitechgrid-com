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
    if (trainingLink) trainingLink.textContent = "AI & Cloud Training";

    if (!nav.querySelector('a[href="proposal.html"]')) {
      const proposalLink = document.createElement("a");
      proposalLink.href = "proposal.html";
      proposalLink.textContent = "Request Proposal";
      const contactLink = nav.querySelector('a[href="contact.html"]');
      if (contactLink) nav.insertBefore(proposalLink, contactLink);
      else nav.appendChild(proposalLink);
    }
  }

  const path = window.location.pathname.toLowerCase();
  const headerCta = document.querySelector(".header-cta");
  if (headerCta && (path.endsWith("/education.html") || path.endsWith("/proposal.html"))) {
    headerCta.removeAttribute("data-consultation-link");
    headerCta.href = "proposal.html";
    headerCta.target = "";
    headerCta.rel = "";
    headerCta.textContent = "Request training proposal";
  }

  if (path.endsWith("/") || path.endsWith("/index.html")) {
    const actions = document.querySelector(".hero-actions");
    if (actions && !actions.querySelector('a[href="education.html"]')) {
      const training = document.createElement("a");
      training.className = "button button-secondary";
      training.href = "education.html";
      training.textContent = "Explore AI & Cloud training";
      actions.appendChild(training);

      const proposal = document.createElement("a");
      proposal.className = "button button-secondary";
      proposal.href = "proposal.html";
      proposal.textContent = "Request training proposal";
      actions.appendChild(proposal);
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
    if (projectType && !Array.from(projectType.options).some(o => o.value === "AI and cloud training proposal")) {
      const option = document.createElement("option");
      option.value = "AI and cloud training proposal";
      option.textContent = "AI and cloud training proposal";
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
