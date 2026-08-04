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

    nav.querySelectorAll('a[href="proposal.html"]').forEach((link) => link.remove());

    if (!nav.querySelector('a[href="digital-presence.html"]')) {
      const digitalLink = document.createElement("a");
      digitalLink.href = "digital-presence.html";
      digitalLink.textContent = "Digital Presence";

      const solutionsLink = nav.querySelector('a[href="solutions.html"]');
      if (solutionsLink) {
        solutionsLink.insertAdjacentElement("afterend", digitalLink);
      } else {
        nav.appendChild(digitalLink);
      }
    }
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

    const coreGrid = document.querySelector(".section .grid-4");
    if (coreGrid && !coreGrid.querySelector('[data-digital-presence-card="true"]')) {
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.digitalPresenceCard = "true";
      card.innerHTML = `
        <div class="icon-box">DP</div>
        <h3>Digital presence & automation</h3>
        <p>Professional websites, AI knowledge assistants, customer workflows, domain and email setup, analytics and managed digital operations.</p>
        <p><a href="digital-presence.html">Explore digital presence services</a></p>
      `;
      coreGrid.appendChild(card);
    }

    const featuredPlatform = Array.from(document.querySelectorAll(".section.surface-alt"))
      .find((section) => section.textContent.includes("ADAPT-UDL"));
    if (featuredPlatform && !document.querySelector('[data-digital-presence-band="true"]')) {
      const section = document.createElement("section");
      section.className = "section";
      section.dataset.digitalPresenceBand = "true";
      section.innerHTML = `
        <div class="container feature-band">
          <div>
            <span class="eyebrow">Digital capability services</span>
            <h2>AI-powered digital presence and business automation</h2>
            <p class="lead">AliTechGrid combines professional websites, approved-knowledge assistants, customer communication, cloud delivery, analytics and practical business workflows.</p>
            <div class="pill-row">
              <span class="pill">Professional websites</span>
              <span class="pill">AI assistants</span>
              <span class="pill">Customer workflows</span>
              <span class="pill">Cloud hosting</span>
              <span class="pill">Managed support</span>
            </div>
            <div class="button-row">
              <a class="button button-primary" href="digital-presence.html">Explore digital presence</a>
              <a class="button button-secondary" href="digital-presence.html#request">Request a scoped proposal</a>
            </div>
          </div>
          <div class="feature-points">
            <div class="feature-point"><h3>Integrated setup</h3><p>Connect domain, website, email, business phone, booking, customer contact and analytics.</p></div>
            <div class="feature-point"><h3>Controlled AI</h3><p>Use approved responses or secured generative models with clear limits and human escalation.</p></div>
            <div class="feature-point"><h3>Business workflows</h3><p>Support enquiry routing, lead capture, booking, notifications and operational handover.</p></div>
            <div class="feature-point"><h3>Managed operation</h3><p>Maintain content, chatbot knowledge, configuration, monitoring and documented ownership.</p></div>
          </div>
        </div>
      `;
      featuredPlatform.insertAdjacentElement("beforebegin", section);
    }
  }

  if (path.endsWith("/solutions.html")) {
    const solutionContainer = document.querySelector("main .section .container");
    if (solutionContainer && !solutionContainer.querySelector('[data-digital-solution="true"]')) {
      const article = document.createElement("article");
      article.className = "solution-detail";
      article.dataset.digitalSolution = "true";
      article.innerHTML = `
        <div><span class="eyebrow">05</span><h2>AI-Powered Digital Presence and Business Automation</h2></div>
        <div>
          <p>Design and operate professional digital experiences that connect websites, approved AI assistance, customer communication, cloud hosting and measurable business workflows.</p>
          <ul>
            <li>Website strategy, responsive design and accessible navigation</li>
            <li>Controlled FAQ assistants and secured generative-AI chatbots</li>
            <li>Domain, DNS, business email and organizational ownership planning</li>
            <li>Booking, lead capture, enquiry routing and notification workflows</li>
            <li>Multilingual customer pathways and human escalation</li>
            <li>Analytics, monitoring, training and managed digital operations</li>
          </ul>
          <p><a href="digital-presence.html">Explore digital presence and automation services</a></p>
        </div>
      `;
      solutionContainer.appendChild(article);
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
    if (projectType) {
      const options = [
        "AI, sovereign AI and cloud training proposal",
        "AI-powered digital presence and business automation"
      ];
      options.reverse().forEach((value) => {
        if (!Array.from(projectType.options).some((option) => option.value === value || option.textContent === value)) {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = value;
          projectType.insertBefore(option, projectType.firstChild);
        }
      });
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

  if (path.endsWith("/") || path.endsWith("/index.html")) {
    const actions = document.querySelector(".hero-actions");
    if (actions && !actions.querySelector('a[href^="tel:"]')) {
      actions.appendChild(createPhoneLink(`Call ${businessPhoneDisplay}`, "button button-secondary"));
    }
  }

  if (path.endsWith("/contact.html")) {
    const consultationRow = Array.from(document.querySelectorAll(".contact-panel .contact-row"))
      .find((row) => row.textContent.includes("A separate international Zoho consultation page"));
    if (consultationRow) {
      consultationRow.innerHTML = `<strong>Phone consultation</strong><br><a href="${businessPhoneHref}" data-phone-link="true">${businessPhoneDisplay}</a><br><span class="muted">Press 2 for AI, cloud, training and digital-presence inquiries.</span>`;
    }
  }

  if (path.endsWith("/proposal.html")) {
    const proposalButtons = document.querySelector(".proposal-help .button-row");
    if (proposalButtons && !proposalButtons.querySelector('a[href^="tel:"]')) {
      proposalButtons.appendChild(createPhoneLink("Call AliTechGrid", "button button-secondary"));
    }
  }

  const footerIdentity = document.querySelector(".site-footer .footer-grid > div:first-child");
  if (footerIdentity && !footerIdentity.querySelector(".footer-phone")) {
    const phoneLine = document.createElement("p");
    phoneLine.className = "footer-phone";
    phoneLine.append("Business phone: ");
    phoneLine.appendChild(createPhoneLink(businessPhoneDisplay));
    footerIdentity.appendChild(phoneLine);
  }

  document.querySelectorAll(".site-footer .footer-links").forEach((list) => {
    if (!list.querySelector('a[href="digital-presence.html"]') && list.closest(".footer-grid")) {
      const heading = list.previousElementSibling;
      if (heading && /explore|solutions|training/i.test(heading.textContent)) {
        const item = document.createElement("li");
        item.innerHTML = '<a href="digital-presence.html">Digital presence & automation</a>';
        list.insertBefore(item, list.children[1] || null);
      }
    }
  });

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

(() => {
  const cssHref = "assets/css/chatbot.css";
  if (!document.querySelector(`link[href="${cssHref}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssHref;
    document.head.appendChild(link);
  }

  const scriptSrc = "assets/js/chatbot.js";
  if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.defer = true;
    document.body.appendChild(script);
  }
})();
