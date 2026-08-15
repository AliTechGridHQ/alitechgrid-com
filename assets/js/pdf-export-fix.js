/* AliTechGrid AI Solution Engine — direct PDF export patch
   Purpose:
   - Replaces the two current window.print()-based PDF actions.
   - Generates and downloads PDFs client-side.
   - Keeps the user on the current results page.
   - Preserves a separate Print option that opens a print-only window.
   - No diagnostic/document content is sent to a PDF API.
*/
(function () {
  "use strict";

  const PDF_LIB =
    "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.14.0/html2pdf.bundle.min.js";

  let pdfLibraryPromise = null;

  function ensurePdfLibrary() {
    if (typeof window.html2pdf === "function") {
      return Promise.resolve(window.html2pdf);
    }
    if (pdfLibraryPromise) return pdfLibraryPromise;

    pdfLibraryPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-alitechgrid-html2pdf]');
      if (existing) {
        existing.addEventListener("load", () => {
          if (typeof window.html2pdf === "function") resolve(window.html2pdf);
          else reject(new Error("PDF library loaded but was unavailable."));
        }, { once: true });
        existing.addEventListener("error", () => reject(new Error("PDF library failed to load.")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = PDF_LIB;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.referrerPolicy = "no-referrer";
      script.dataset.alitechgridHtml2pdf = "1";
      script.addEventListener("load", () => {
        if (typeof window.html2pdf === "function") resolve(window.html2pdf);
        else reject(new Error("PDF library loaded but was unavailable."));
      }, { once: true });
      script.addEventListener("error", () => reject(new Error("PDF library failed to load.")), { once: true });
      document.head.appendChild(script);
    });

    return pdfLibraryPromise;
  }

  function ensurePdfStyles() {
    if (document.getElementById("alitechgrid-pdf-export-styles")) return;

    const style = document.createElement("style");
    style.id = "alitechgrid-pdf-export-styles";
    style.textContent = `
      .atg-pdf-stage{
        position:fixed!important;
        left:-12000px!important;
        top:0!important;
        width:794px!important;
        background:#fff!important;
        color:#142a43!important;
        z-index:-9999!important;
        opacity:1!important;
        pointer-events:none!important;
      }
      .atg-pdf-stage .decision-doc{
        width:794px!important;
        max-width:none!important;
        margin:0!important;
        border:0!important;
        border-radius:0!important;
        box-shadow:none!important;
        overflow:visible!important;
      }
      .atg-pdf-stage .decision-cover{
        min-height:1050px!important;
        border-radius:0!important;
        page-break-after:always!important;
        break-after:page!important;
      }
      .atg-pdf-stage .decision-body{
        background:#fff!important;
      }
      .atg-pdf-stage .decision-doc h2,
      .atg-pdf-stage .decision-doc h3{
        break-after:avoid!important;
        page-break-after:avoid!important;
      }
      .atg-pdf-stage .decision-table,
      .atg-pdf-stage .decision-final,
      .atg-pdf-stage .score-grid,
      .atg-pdf-stage .scenario,
      .atg-pdf-stage .swot>div,
      .atg-pdf-stage .timeline>div{
        break-inside:avoid!important;
        page-break-inside:avoid!important;
      }
      .atg-blueprint-body{padding:36px 46px 42px;background:#fff}
      .atg-blueprint-section{margin:0 0 28px;padding:0 0 23px;border-bottom:1px solid #d5e0e8}
      .atg-blueprint-section:last-child{border-bottom:0}
      .atg-blueprint-section h2{font-family:Georgia,"Times New Roman",serif;color:#173451;font-size:1.55rem;margin:0 0 12px}
      .atg-blueprint-body .score-grid{grid-template-columns:repeat(5,1fr)!important}
      .atg-blueprint-body .score-box{
        background:#f5f8fb!important;
        border:1px solid #d6e2ea!important;
        color:#173451!important;
      }
      .atg-blueprint-body .score-box span{color:#577089!important}
      .atg-blueprint-body .check{color:#425d73!important}
      .atg-blueprint-body .scenario-grid{grid-template-columns:repeat(3,1fr)!important}
      .atg-blueprint-body .scenario{
        background:#f7fafc!important;
        border:1px solid #d2dfe8!important;
        color:#173451!important;
      }
      .atg-blueprint-body .scenario.recommended{
        border-color:#46a99f!important;
        box-shadow:0 0 0 1px rgba(70,169,159,.18) inset!important;
      }
      .atg-blueprint-body .scenario p,
      .atg-blueprint-body .scenario li{color:#425d73!important}
      .atg-blueprint-body .swot>div,
      .atg-blueprint-body .timeline>div{
        background:#f7fafc!important;
        border:1px solid #d2dfe8!important;
        color:#173451!important;
      }
      .atg-blueprint-body .swot p,
      .atg-blueprint-body .timeline p{color:#425d73!important}
      .atg-blueprint-body .pill{
        background:#eef5f8!important;
        border-color:#c5d7e2!important;
        color:#284d69!important;
      }
      .atg-blueprint-summary{
        font-size:.94rem;
        color:#425d73;
        line-height:1.7;
        padding:16px 18px;
        background:#f5f9fb;
        border-left:4px solid #46a99f;
        border-radius:0 12px 12px 0;
      }
      .atg-pdf-status{
        position:fixed;
        right:22px;
        bottom:22px;
        z-index:10000;
        max-width:390px;
        padding:13px 16px;
        border-radius:12px;
        background:#102941;
        color:#eef6ff;
        border:1px solid #355f7e;
        box-shadow:0 16px 42px rgba(0,0,0,.32);
        font:700 .85rem/1.45 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;
      }
      .atg-pdf-status.ok{border-color:#46a99f}
      .atg-pdf-status.error{border-color:#c65b6b}
      @media(max-width:760px){
        .atg-pdf-status{left:12px;right:12px;bottom:12px;max-width:none}
      }
    `;
    document.head.appendChild(style);
  }

  function notify(message, kind) {
    document.querySelectorAll(".atg-pdf-status").forEach((el) => el.remove());
    const el = document.createElement("div");
    el.className = "atg-pdf-status " + (kind || "");
    el.setAttribute("role", "status");
    el.textContent = message;
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), kind === "error" ? 6500 : 3200);
  }

  function safeFilename(value) {
    return String(value || "")
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 90) || "AliTechGrid_Document";
  }

  function dateStamp() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function getOrganizationStem() {
    const title = document.getElementById("result-title");
    const text = title ? title.textContent.replace(/\s+AI Solution Blueprint\s*$/i, "") : "";
    return safeFilename(text || "Organization");
  }

  function currentDocumentTitle() {
    const selector = document.getElementById("doc-type");
    if (!selector) return "AI_Decision_Document";
    const option = selector.options[selector.selectedIndex];
    return safeFilename(option ? option.textContent : "AI_Decision_Document");
  }

  function addTextSection(body, title, source) {
    if (!source) return;
    const section = document.createElement("section");
    section.className = "atg-blueprint-section";
    const heading = document.createElement("h2");
    heading.textContent = title;
    section.appendChild(heading);
    const clone = source.cloneNode(true);
    clone.removeAttribute("id");
    section.appendChild(clone);
    body.appendChild(section);
  }

  function addHtmlSection(body, title, html) {
    const section = document.createElement("section");
    section.className = "atg-blueprint-section";
    const heading = document.createElement("h2");
    heading.textContent = title;
    section.appendChild(heading);
    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    section.appendChild(wrap);
    body.appendChild(section);
  }

  function buildBlueprintDocument() {
    const titleText = (document.getElementById("result-title") || {}).textContent || "AI Solution Blueprint";
    const scoreText = (document.getElementById("overall-score") || {}).textContent || "";
    const reasoningText = (document.getElementById("reasoning") || {}).textContent || "";
    const today = new Intl.DateTimeFormat("en-CA", {
      year: "numeric", month: "long", day: "numeric"
    }).format(new Date());

    const article = document.createElement("article");
    article.className = "decision-doc atg-blueprint-doc";

    const cover = document.createElement("section");
    cover.className = "decision-cover";
    cover.innerHTML = `
      <div class="decision-brand">
        <img src="assets/img/alitechgrid-logo.svg" alt="AliTechGrid">
        <span>AI Solution Intelligence</span>
      </div>
      <div class="decision-kicker">Adaptive Diagnostic · Readiness · Strategy · Implementation</div>
      <h1>${escapeHtml(titleText)}</h1>
      <p class="decision-subtitle">Generated decision-oriented blueprint</p>
      <div class="decision-meta">
        <div><span>Readiness</span><b>${escapeHtml(scoreText)}</b></div>
        <div><span>Prepared</span><b>${escapeHtml(today)}</b></div>
        <div><span>Method</span><b>AliTechGrid transparent decision rules</b></div>
        <div><span>Status</span><b>Professional working output</b></div>
      </div>
      <div class="decision-cover-note">
        Generated from the AliTechGrid AI Solution Engine. Validate organization-specific facts,
        financial assumptions, legal terms, accreditation, privacy, security and executive approvals
        before formal adoption or signature.
      </div>
    `;
    article.appendChild(cover);

    const body = document.createElement("section");
    body.className = "atg-blueprint-body";

    const summary = document.createElement("section");
    summary.className = "atg-blueprint-section";
    summary.innerHTML = `<h2>Executive diagnostic summary</h2>
      <div class="atg-blueprint-summary">${escapeHtml(reasoningText)}</div>`;
    body.appendChild(summary);

    addTextSection(body, "Readiness scorecard", document.getElementById("score-grid"));
    addTextSection(body, "Priority gaps", document.getElementById("gap-list"));
    addTextSection(body, "Three solution scenarios", document.getElementById("scenario-grid"));

    const architecture = (document.getElementById("architecture-rec") || {}).textContent || "";
    const collaboration = (document.getElementById("collaboration-rec") || {}).textContent || "";
    addHtmlSection(
      body,
      "Architecture & collaboration direction",
      `<p><b>Architecture:</b> ${escapeHtml(architecture)}</p>
       <p><b>Collaboration:</b> ${escapeHtml(collaboration)}</p>`
    );

    addTextSection(body, "SWOT snapshot", document.getElementById("swot-grid"));
    addTextSection(body, "90-day roadmap", document.getElementById("roadmap"));
    addTextSection(body, "Evidence & KPIs", document.getElementById("kpis"));

    const assumptions = (document.getElementById("assumptions") || {}).textContent || "";
    addHtmlSection(body, "Planning assumptions & decision integrity", `<p>${escapeHtml(assumptions)}</p>`);

    article.appendChild(body);

    const footer = document.createElement("footer");
    footer.className = "decision-doc-footer";
    footer.innerHTML = `<span>AliTechGrid · Sovereign AI · Education · Innovation</span>
                        <span>Professional working blueprint · Human validation required</span>`;
    article.appendChild(footer);

    return article;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[ch]);
  }

  function createStage(content) {
    ensurePdfStyles();
    const stage = document.createElement("div");
    stage.className = "atg-pdf-stage";
    stage.setAttribute("aria-hidden", "true");
    stage.appendChild(content);
    document.body.appendChild(stage);
    return stage;
  }

  async function downloadPdf(content, filename, button) {
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Generating PDF…";

    let stage = null;
    try {
      const html2pdf = await ensurePdfLibrary();
      stage = createStage(content);

      await html2pdf()
        .set({
          margin: [7, 7, 9, 7],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 794
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: true
          },
          pagebreak: {
            mode: ["css", "legacy"],
            after: [".decision-cover"],
            avoid: [".decision-table", ".decision-final", ".scenario", ".score-box"]
          }
        })
        .from(stage)
        .save();

      notify("PDF generated successfully. Your answers and results remain on this page.", "ok");
    } catch (error) {
      console.error("AliTechGrid PDF export failed:", error);
      notify("PDF generation failed. Your results are preserved. Use the Print button as a fallback.", "error");
    } finally {
      if (stage) stage.remove();
      button.disabled = false;
      button.textContent = original;
    }
  }

  function printableHtml(content, title) {
    const styleLinks = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .map((link) => `<link rel="stylesheet" href="${escapeHtml(link.href)}">`)
      .join("");

    return `<!doctype html>
      <html lang="en-CA">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>${escapeHtml(title)}</title>
        ${styleLinks}
        <style>
          body{background:#fff!important;color:#142a43!important;margin:0!important}
          .decision-doc{border:0!important;border-radius:0!important;box-shadow:none!important}
          .decision-cover{min-height:245mm!important;page-break-after:always!important}
          @page{size:A4;margin:12mm}
          @media print{
            .decision-doc{box-shadow:none!important}
            .decision-cover{min-height:245mm!important;page-break-after:always!important}
          }
        </style>
      </head>
      <body>${content.outerHTML}
      <script>
        window.addEventListener("load",function(){
          setTimeout(function(){window.print();},250);
        });
      <\/script>
      </body></html>`;
  }

  function printWithoutLeaving(content, title) {
    const printWindow = window.open("", "_blank", "width=980,height=760");
    if (!printWindow) {
      notify("Your browser blocked the print window. Allow pop-ups for alitechgrid.com and try again.", "error");
      return;
    }
    printWindow.opener = null;
    printWindow.document.open();
    printWindow.document.write(printableHtml(content, title));
    printWindow.document.close();
  }

  function makePrintButton(downloadButton, getContent, titleGetter) {
    if (!downloadButton || downloadButton.dataset.atgPrintSibling === "1") return;
    downloadButton.dataset.atgPrintSibling = "1";

    const printButton = document.createElement("button");
    printButton.type = "button";
    printButton.className = "btn btn-ghost";
    printButton.textContent = "Print";
    printButton.dataset.atgSecondaryPrint = "1";
    printButton.addEventListener("click", (event) => {
      event.preventDefault();
      const content = getContent();
      if (!content) {
        notify("Generate the document first, then print it.", "error");
        return;
      }
      printWithoutLeaving(content, titleGetter());
    });
    downloadButton.insertAdjacentElement("afterend", printButton);
  }

  function install() {
    ensurePdfStyles();

    const decisionButton = document.getElementById("print-document");
    if (decisionButton) {
      decisionButton.textContent = "Download Decision PDF";
      decisionButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const source = document.querySelector("#document-content .decision-doc");
        if (!source) {
          notify("Generate the decision document first, then download the PDF.", "error");
          return;
        }

        const filename =
          `AliTechGrid_${currentDocumentTitle()}_${getOrganizationStem()}_${dateStamp()}.pdf`;

        downloadPdf(source.cloneNode(true), filename, decisionButton);
      }, true);

      makePrintButton(
        decisionButton,
        () => {
          const source = document.querySelector("#document-content .decision-doc");
          return source ? source.cloneNode(true) : null;
        },
        () => currentDocumentTitle().replaceAll("_", " ")
      );
    }

    const blueprintButton = document.getElementById("print-result");
    if (blueprintButton) {
      blueprintButton.textContent = "Download Blueprint PDF";
      blueprintButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const result = document.getElementById("engine-result");
        if (!result || !result.classList.contains("show")) {
          notify("Complete the diagnostic first, then download the Blueprint PDF.", "error");
          return;
        }

        const filename =
          `AliTechGrid_AI_Solution_Blueprint_${getOrganizationStem()}_${dateStamp()}.pdf`;

        downloadPdf(buildBlueprintDocument(), filename, blueprintButton);
      }, true);

      makePrintButton(
        blueprintButton,
        () => buildBlueprintDocument(),
        () => "AliTechGrid AI Solution Blueprint"
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();
