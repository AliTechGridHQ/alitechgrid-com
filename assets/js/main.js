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


  // Public AliTechGrid business telephone and click-to-call support.
  const businessPhoneDisplay = "+1 778-358-4040";
  const businessPhoneHref = "tel:+17783584040";

  const createPhoneLink = (label, className = "") => {
    const link = document.createElement("a");
    link.href = businessPhoneHref;
    link.textContent = label;
    link.setAttribute("aria-label", `Call AliTechGrid at ${businessPhoneDisplay}`);
    link.dataset.phoneLink = "true";
    if (className) link.className = className;
    return link;
  };

  // Add the telephone to Organization structured data for search engines.
  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    try {
      const data = JSON.parse(script.textContent);
      if (data && (data["@type"] === "Organization" || data["@type"] === "LocalBusiness")) {
        data.telephone = businessPhoneDisplay;
        script.textContent = JSON.stringify(data, null, 2);
      }
    } catch {
      // Leave unrelated or non-standard structured data unchanged.
    }
  });

  // Show a call option on the international homepage.
  if (path.endsWith("/") || path.endsWith("/index.html")) {
    const actions = document.querySelector(".hero-actions");
    if (actions && !actions.querySelector('a[href^="tel:"]')) {
      actions.appendChild(createPhoneLink(`Call ${businessPhoneDisplay}`, "button button-secondary"));
    }
  }

  // Replace the old internal Zoho-planning note with the live business phone.
  if (path.endsWith("/contact.html")) {
    const consultationRow = Array.from(document.querySelectorAll(".contact-panel .contact-row"))
      .find((row) => row.textContent.includes("A separate international Zoho consultation page"));
    if (consultationRow) {
      consultationRow.innerHTML = `<strong>Phone consultation</strong><br><a href="${businessPhoneHref}" data-phone-link="true">${businessPhoneDisplay}</a><br><span class="muted">Press 2 for AI, cloud and training inquiries.</span>`;
    }
  }

  // Add a direct call button to the proposal page.
  if (path.endsWith("/proposal.html")) {
    const proposalButtons = document.querySelector(".proposal-help .button-row");
    if (proposalButtons && !proposalButtons.querySelector('a[href^="tel:"]')) {
      proposalButtons.appendChild(createPhoneLink("Call AliTechGrid", "button button-secondary"));
    }
  }

  // Display the business phone in the footer on every page.
  const footerIdentity = document.querySelector(".site-footer .footer-grid > div:first-child");
  if (footerIdentity && !footerIdentity.querySelector(".footer-phone")) {
    const phoneLine = document.createElement("p");
    phoneLine.className = "footer-phone";
    phoneLine.append("Business phone: ");
    phoneLine.appendChild(createPhoneLink(businessPhoneDisplay));
    footerIdentity.appendChild(phoneLine);
  }

  // Measure click-to-call actions in the correct GA4 property.
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    if (link.dataset.phoneTrackingReady === "true") return;
    link.dataset.phoneTrackingReady = "true";
    link.addEventListener("click", () => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "phone_click", {
          phone_number: businessPhoneDisplay,
          page_location: window.location.href,
          link_text: link.textContent.trim()
        });
      }
    });
  });

})();
