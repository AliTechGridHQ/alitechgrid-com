(() => {
  "use strict";

  if (document.getElementById("atg-chatbot")) return;

  const BUSINESS_PHONE_DISPLAY = "+1 778-358-4040";
  const BUSINESS_PHONE_HREF = "tel:+17783584040";
  const CONTACT_EMAIL = "contact@alitechgrid.com";
  const TRAINING_EMAIL = "training@alitechgrid.com";
  const SALES_EMAIL = "sales@alitechgrid.com";
  const SUPPORT_EMAIL = "support@alitechgrid.com";

  const track = (eventName, details = {}) => {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, {
        chatbot_name: "AliTechGrid International Virtual Assistant",
        page_location: window.location.href,
        ...details
      });
    }
  };

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const widget = document.createElement("div");
  widget.id = "atg-chatbot";
  widget.className = "atg-chatbot";
  widget.innerHTML = `
    <button class="atg-chat-launcher" type="button" aria-controls="atg-chat-panel" aria-expanded="false">
      <span class="atg-chat-launcher-icon" aria-hidden="true">💬</span>
      <span>Ask AliTechGrid</span>
    </button>
    <section class="atg-chat-panel" id="atg-chat-panel" role="dialog" aria-modal="false" aria-label="AliTechGrid International virtual assistant" hidden>
      <header class="atg-chat-header">
        <div>
          <strong>AliTechGrid International</strong>
          <span>Virtual Assistant</span>
        </div>
        <button class="atg-chat-close" type="button" aria-label="Close virtual assistant">×</button>
      </header>
      <div class="atg-chat-log" role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="atg-chat-quick" aria-label="Suggested questions"></div>
      <form class="atg-chat-form">
        <label class="atg-chat-label" for="atg-chat-input">Type your question</label>
        <div class="atg-chat-input-row">
          <input id="atg-chat-input" name="message" type="text" maxlength="300" autocomplete="off" placeholder="Ask about AI, cloud, training or ADAPT-UDL" required>
          <button type="submit">Send</button>
        </div>
      </form>
      <p class="atg-chat-privacy">Do not enter passwords, payment-card details, student records, confidential tenders, restricted institutional data or sensitive personal information.</p>
    </section>
  `;

  document.body.appendChild(widget);

  const launcher = widget.querySelector(".atg-chat-launcher");
  const panel = widget.querySelector(".atg-chat-panel");
  const closeButton = widget.querySelector(".atg-chat-close");
  const log = widget.querySelector(".atg-chat-log");
  const quick = widget.querySelector(".atg-chat-quick");
  const form = widget.querySelector(".atg-chat-form");
  const input = widget.querySelector(".atg-chat-input-row input");

  const scrollToLatest = () => {
    requestAnimationFrame(() => {
      log.scrollTop = log.scrollHeight;
    });
  };

  const addMessage = (sender, html) => {
    const message = document.createElement("div");
    message.className = `atg-chat-message atg-chat-message-${sender}`;
    message.innerHTML = html;
    log.appendChild(message);
    scrollToLatest();
  };

  const setQuickActions = (actions) => {
    quick.innerHTML = "";
    actions.forEach(({ label, intent }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.dataset.intent = intent;
      quick.appendChild(button);
    });
  };

  const linkButtons = (items) => `
    <div class="atg-chat-actions">
      ${items.map(({ label, href, primary = false }) => `
        <a class="${primary ? "is-primary" : ""}" href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>
      `).join("")}
    </div>
  `;

  const mainActions = [
    { label: "AI & Sovereign AI", intent: "ai" },
    { label: "Cloud solutions", intent: "cloud" },
    { label: "Training programs", intent: "training" },
    { label: "ADAPT-UDL", intent: "adapt" },
    { label: "Request proposal", intent: "proposal" },
    { label: "Contact AliTechGrid", intent: "contact" }
  ];

  const responses = {
    ai: () => ({
      text: `<strong>AI strategy, sovereign AI and responsible adoption</strong><br>AliTechGrid supports institutions with AI readiness, use-case discovery, governance, human oversight, approved knowledge sources, traceability, private or local model options, data-residency planning and pilot roadmaps. Final recommendations depend on requirements, evidence and institutional constraints.`,
      links: [
        { label: "Explore AI solutions", href: "solutions.html", primary: true },
        { label: "Request proposal", href: "proposal.html" }
      ]
    }),
    sovereign: () => ({
      text: `<strong>Sovereign and private AI</strong><br>Engagements may examine local, on-premises, private-cloud, Canadian-region or hybrid approaches. The focus is institutional control over data, models, approved evidence, access, logging, retention, auditability and accountable human review.`,
      links: [
        { label: "View sovereign AI solutions", href: "solutions.html", primary: true },
        { label: "Discuss requirements", href: "contact.html" }
      ]
    }),
    cloud: () => ({
      text: `<strong>Cloud architecture and enablement</strong><br>AliTechGrid supports cloud foundations, architecture discussions, AWS-focused training and labs, migration-readiness, identity, networking, security, cost awareness, operations and cloud options for AI workloads.`,
      links: [
        { label: "Explore cloud solutions", href: "solutions.html", primary: true },
        { label: "Request proposal", href: "proposal.html" }
      ]
    }),
    training: () => ({
      text: `<strong>AI, sovereign AI and cloud training</strong><br>Programs can be designed for executives, faculty, instructors, technical teams, corporate staff or mixed cohorts. Formats include briefings, workshops, technical short courses, guided labs, capability programs and train-the-trainer pathways.`,
      links: [
        { label: "Explore training", href: "education.html", primary: true },
        { label: "Request training proposal", href: "proposal.html" },
        { label: "Email training", href: `mailto:${TRAINING_EMAIL}` }
      ]
    }),
    delivery: () => ({
      text: `<strong>Delivery formats</strong><br>Programs may be delivered live online, in person, hybrid or as a facilitated blended model. Typical options include a 1–3 hour executive briefing, half-day or full-day workshop, 2–5 day short course, or 4–12 week capability program. Final duration is confirmed during scoping.`,
      links: [
        { label: "View training formats", href: "education.html", primary: true },
        { label: "Request proposal", href: "proposal.html" }
      ]
    }),
    audience: () => ({
      text: `<strong>Who the programs serve</strong><br>AliTechGrid develops role-appropriate pathways for executives and decision-makers, faculty and instructors, IT and cloud professionals, corporate teams, students or workforce learners, and mixed institutional cohorts.`,
      links: [
        { label: "Explore training pathways", href: "education.html", primary: true },
        { label: "Request proposal", href: "proposal.html" }
      ]
    }),
    education: () => ({
      text: `<strong>Educational technology and curriculum modernization</strong><br>Support may include AI-integrated curriculum review, learning-outcome and assessment alignment, faculty-development packages, AI/cloud/Python course design, evidence traceability and academic quality controls.`,
      links: [
        { label: "Explore solutions", href: "solutions.html", primary: true },
        { label: "Discuss curriculum needs", href: "contact.html" }
      ]
    }),
    adapt: () => ({
      text: `<strong>ADAPT-UDL</strong><br>ADAPT-UDL is an evolving sovereign-AI platform concept and prototype program for the recurring academic course lifecycle. It is intended to complement established LMS environments, keep instructor review central, use approved evidence, support UDL-informed workflows and provide role-based institutional oversight. Students are not direct platform users in the current concept.`,
      links: [
        { label: "View ADAPT-UDL", href: "adapt-udl.html", primary: true },
        { label: "Request demonstration discussion", href: "contact.html" },
        { label: "Explore partnership pathway", href: "partnerships.html" }
      ]
    }),
    partnership: () => ({
      text: `<strong>Institutional partnerships and pilots</strong><br>AliTechGrid supports structured discovery, demonstrations, pilot design and implementation planning for universities, colleges, training organizations, public-sector organizations, businesses and suitable technology partners. Commercial scope follows technical and academic discovery.`,
      links: [
        { label: "Explore partnerships", href: "partnerships.html", primary: true },
        { label: "Start a discussion", href: "contact.html" }
      ]
    }),
    proposal: () => ({
      text: `<strong>Request a tailored proposal</strong><br>The proposal form is designed for institutional or corporate AI, sovereign-AI and cloud training. Prepare your organization, audience, objectives, participant count, preferred delivery, duration, sovereignty needs, environment, timeline and expected deliverables. Submission starts a scoping process and is not a binding commitment.`,
      links: [
        { label: "Open proposal form", href: "proposal.html", primary: true },
        { label: "Email training team", href: `mailto:${TRAINING_EMAIL}` }
      ]
    }),
    consultation: () => ({
      text: `<strong>Institutional consultation</strong><br>Use the contact page to describe the objective, organization type, stakeholders, country or region and current challenge. A separate international scheduling link has not yet been published, so the current consultation path is email or telephone.`,
      links: [
        { label: "Contact AliTechGrid", href: "contact.html", primary: true },
        { label: "Call and press 2", href: BUSINESS_PHONE_HREF }
      ]
    }),
    price: () => ({
      text: `<strong>Fees and pricing</strong><br>AliTechGrid does not publish a single fixed price because scope varies by audience, technical depth, delivery format, duration, labs, travel, intellectual-property terms and required deliverables. A written proposal is prepared after scoping.`,
      links: [
        { label: "Request proposal", href: "proposal.html", primary: true },
        { label: "Email sales", href: `mailto:${SALES_EMAIL}` }
      ]
    }),
    contact: () => ({
      text: `<strong>Contact AliTechGrid</strong><br>Call ${BUSINESS_PHONE_DISPLAY}. Press <strong>0</strong> for Customer Support, <strong>1</strong> for Technical Support, or <strong>2</strong> for AI, Cloud Consultancy & Training. General inquiries: ${CONTACT_EMAIL}. Training and proposals: ${TRAINING_EMAIL}.`,
      links: [
        { label: "Call now", href: BUSINESS_PHONE_HREF, primary: true },
        { label: "Contact page", href: "contact.html" },
        { label: "Email training", href: `mailto:${TRAINING_EMAIL}` }
      ]
    }),
    support: () => ({
      text: `<strong>Support and service routing</strong><br>For website, account or general support, email ${SUPPORT_EMAIL} or call ${BUSINESS_PHONE_DISPLAY}. Press <strong>0</strong> for Customer Support or <strong>1</strong> for Technical Support. For AI, cloud and training, press <strong>2</strong>.`,
      links: [
        { label: "Email support", href: `mailto:${SUPPORT_EMAIL}`, primary: true },
        { label: "Call AliTechGrid", href: BUSINESS_PHONE_HREF }
      ]
    }),
    privacy: () => ({
      text: `<strong>Protect confidential information</strong><br>Do not enter passwords, payment-card details, student records, health information, confidential tenders, restricted institutional data, private business credentials or controlled documents in this chat or public forms. A secure process can be agreed after the initial discussion.`,
      links: [
        { label: "Read privacy policy", href: "privacy.html", primary: true },
        { label: "Contact AliTechGrid", href: "contact.html" }
      ]
    }),
    worldwide: () => ({
      text: `<strong>International engagement</strong><br>AliTechGrid is Canada-based and internationally focused. Remote consultation, online training, demonstrations and scoped collaborations may support organizations in different countries. In-person availability, travel, legal terms and delivery conditions are confirmed during scoping.`,
      links: [
        { label: "Start a discussion", href: "contact.html", primary: true },
        { label: "Request proposal", href: "proposal.html" }
      ]
    }),
    fallback: () => ({
      text: `I can help with AI strategy, sovereign and private AI, cloud architecture, training, curriculum modernization, ADAPT-UDL, partnerships, proposals and contact options. For a question requiring a person, call ${BUSINESS_PHONE_DISPLAY} and press <strong>2</strong>.`,
      links: [
        { label: "Explore solutions", href: "solutions.html", primary: true },
        { label: "Request proposal", href: "proposal.html" },
        { label: "Contact page", href: "contact.html" }
      ]
    })
  };

  const intentFromText = (raw) => {
    const text = raw.toLowerCase().replace(/[^a-z0-9\s&+.-]/g, " ");
    const has = (...terms) => terms.some((term) => text.includes(term));

    if (has("password", "credit card", "debit card", "payment card", "student record", "student data", "confidential", "restricted data", "tender", "procurement document", "privacy", "personal information")) return "privacy";
    if (has("price", "pricing", "fee", "cost", "budget", "how much", "quotation", "quote")) return "price";
    if (has("proposal", "rfp", "request for proposal", "training request", "deadline", "participants", "deliverables")) return "proposal";
    if (has("consultation", "meeting", "appointment", "book a call", "schedule", "discuss")) return "consultation";
    if (has("contact", "phone", "telephone", "call", "email", "human", "person", "operator")) return "contact";
    if (has("support", "technical support", "customer support", "website issue", "account issue")) return "support";
    if (has("adapt udl", "adapt-udl", "udl", "learning management system", "lms", "course lifecycle", "faculty workflow", "academic dashboard")) return "adapt";
    if (has("partner", "partnership", "pilot", "demonstration", "proof of concept", "collaboration", "university", "college")) return "partnership";
    if (has("sovereign", "private ai", "local ai", "on premises ai", "on-premises ai", "data residency", "canadian region", "model control")) return "sovereign";
    if (has("curriculum", "assessment", "faculty development", "educational technology", "course design", "learning outcome", "academic integrity")) return "education";
    if (has("delivery", "online", "in person", "hybrid", "workshop", "short course", "briefing", "duration", "weeks", "days")) return "delivery";
    if (has("executive", "faculty", "instructor", "technical team", "workforce", "audience", "learner", "student")) return "audience";
    if (has("training", "course", "workshop", "train the trainer", "train-the-trainer", "lab", "certification", "learning program")) return "training";
    if (has("cloud", "aws", "azure", "google cloud", "architecture", "migration", "networking", "identity", "devops", "container", "infrastructure")) return "cloud";
    if (has("worldwide", "international", "country", "region", "remote", "overseas", "global")) return "worldwide";
    if (has("ai", "artificial intelligence", "generative ai", "responsible ai", "governance", "automation", "approved knowledge", "retrieval")) return "ai";
    return "fallback";
  };

  const respond = (intent, userLabel = "") => {
    if (userLabel) addMessage("user", escapeHtml(userLabel));
    const response = (responses[intent] || responses.fallback)();
    addMessage("bot", `${response.text}${response.links ? linkButtons(response.links) : ""}`);
    setQuickActions(mainActions);
    track("chatbot_intent", { chatbot_intent: intent });
  };

  const showPanel = () => {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    launcher.classList.add("is-hidden");
    input.focus();
    track("chatbot_open");
  };

  const hidePanel = () => {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.classList.remove("is-hidden");
    launcher.focus();
    track("chatbot_close");
  };

  launcher.addEventListener("click", showPanel);
  closeButton.addEventListener("click", hidePanel);

  quick.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-intent]");
    if (!button) return;
    respond(button.dataset.intent, button.textContent.trim());
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    input.value = "";
    respond(intentFromText(value), value);
  });

  widget.addEventListener("click", (event) => {
    const link = event.target.closest(".atg-chat-actions a");
    if (!link) return;
    track("chatbot_link_click", {
      link_text: link.textContent.trim(),
      link_url: link.href
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) hidePanel();
  });

  addMessage("bot", `<strong>Hello! I’m the AliTechGrid International virtual assistant.</strong><br>I can help with AI, sovereign AI, cloud, training, ADAPT-UDL, partnerships, proposals and contact options.`);
  addMessage("bot", `This is a controlled information assistant. It does not create binding commitments, prices or technical guarantees.`);
  addMessage("bot", `For your security, do not enter confidential institutional information, passwords, payment details, student records or restricted documents.`);
  setQuickActions(mainActions);
})();
