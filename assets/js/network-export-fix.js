/* AliTechGrid AI Collaboration Network — direct PDF export fix
   Converts the prepared Collaboration Profile & Opportunity Summary into a
   client-side PDF download and prevents the existing window.print() action
   from taking the visitor away from the prepared result state.
*/
(function(){
  'use strict';
  const button=document.getElementById('network-print');
  const summary=document.getElementById('network-summary-card');
  const ready=document.getElementById('network-request-ready');
  if(!button||!summary||!ready)return;

  const PDF_LIB='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.14.0/html2pdf.bundle.min.js';
  let libraryPromise=null;

  function ensureLibrary(){
    if(typeof window.html2pdf==='function')return Promise.resolve(window.html2pdf);
    if(libraryPromise)return libraryPromise;
    libraryPromise=new Promise((resolve,reject)=>{
      const existing=document.querySelector('script[data-atg-html2pdf]');
      if(existing){
        existing.addEventListener('load',()=>typeof window.html2pdf==='function'?resolve(window.html2pdf):reject(new Error('PDF library unavailable.')),{once:true});
        existing.addEventListener('error',()=>reject(new Error('PDF library failed to load.')),{once:true});
        return;
      }
      const s=document.createElement('script');
      s.src=PDF_LIB;s.async=true;s.crossOrigin='anonymous';s.referrerPolicy='no-referrer';s.dataset.atgHtml2pdf='1';
      s.addEventListener('load',()=>typeof window.html2pdf==='function'?resolve(window.html2pdf):reject(new Error('PDF library unavailable.')),{once:true});
      s.addEventListener('error',()=>reject(new Error('PDF library failed to load.')),{once:true});
      document.head.appendChild(s);
    });
    return libraryPromise;
  }

  function status(text,kind){
    document.querySelectorAll('.atg-network-export-status').forEach(x=>x.remove());
    const n=document.createElement('div');
    n.className='atg-network-export-status';n.setAttribute('role','status');n.textContent=text;
    Object.assign(n.style,{position:'fixed',right:'20px',bottom:'20px',zIndex:'10000',maxWidth:'390px',padding:'13px 16px',borderRadius:'12px',background:'#102941',color:'#eef6ff',border:'1px solid '+(kind==='error'?'#c65b6b':'#46a99f'),boxShadow:'0 16px 42px rgba(0,0,0,.32)',font:'700 .85rem/1.45 Inter,system-ui,-apple-system,"Segoe UI",sans-serif'});
    document.body.appendChild(n);setTimeout(()=>n.remove(),kind==='error'?6500:3200);
  }

  function reference(){
    const el=summary.querySelector('.summary-ref');
    return (el&&el.textContent.trim())||'Collaboration_Profile';
  }
  function safeName(v){return String(v||'AliTechGrid_Collaboration_Profile').replace(/[<>:"/\\|?*\u0000-\u001F]/g,'').replace(/\s+/g,'_').slice(0,90);}
  function stamp(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}

  function buildDocument(){
    const clone=summary.cloneNode(true);
    clone.removeAttribute('id');
    const wrapper=document.createElement('article');
    wrapper.className='atg-collab-pdf';
    wrapper.innerHTML=`<section class="atg-collab-cover">
      <img src="assets/img/alitechgrid-logo.svg" alt="AliTechGrid">
      <div class="atg-kicker">AI Collaboration Network · Controlled Expression of Interest</div>
      <h1>Collaboration Profile & Opportunity Summary</h1>
      <p>Prepared locally from the information entered by the visitor.</p>
      <div class="atg-ref">${reference()}</div>
      <div class="atg-note">This document is an expression of interest only. It is not a credential, endorsement, employment record, partnership agreement or contract.</div>
    </section><section class="atg-collab-body"></section>
    <footer>AliTechGrid · Sovereign AI · Education · Innovation</footer>`;
    wrapper.querySelector('.atg-collab-body').appendChild(clone);
    return wrapper;
  }

  function ensureStyles(){
    if(document.getElementById('atg-network-pdf-style'))return;
    const st=document.createElement('style');st.id='atg-network-pdf-style';st.textContent=`
      .atg-network-pdf-stage{position:absolute!important;left:0!important;top:0!important;width:794px!important;background:#fff!important;color:#142a43!important;z-index:-9999!important;pointer-events:none!important}
      .atg-collab-pdf{width:794px;background:#fff;color:#173451;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
      .atg-collab-cover{min-height:1030px;padding:70px 58px;background:linear-gradient(145deg,#f9fbfd,#eef6fa 58%,#f7f8ff);border-bottom:5px solid #5670e7;display:flex;flex-direction:column;justify-content:center;page-break-after:always;break-after:page}
      .atg-collab-cover img{width:255px;max-width:55%;margin-bottom:75px}.atg-kicker{color:#227e79;text-transform:uppercase;letter-spacing:.13em;font-size:12px;font-weight:800}.atg-collab-cover h1{font-family:Georgia,"Times New Roman",serif;font-size:42px;line-height:1.12;margin:18px 0;color:#173451}.atg-collab-cover p{font-size:18px;color:#557188}.atg-ref{margin-top:34px;padding:16px;border:1px solid #c9d9e4;border-radius:12px;background:#fff;font-weight:900;letter-spacing:.07em}.atg-note{margin-top:28px;padding:15px 17px;border-left:4px solid #46a99f;background:#fff;color:#577089;font-size:13px;line-height:1.55}
      .atg-collab-body{padding:45px 52px}.atg-collab-body .collab-summary{box-shadow:none!important;border:0!important;background:#fff!important;color:#173451!important}.atg-collab-body .collab-summary-head{display:none!important}.atg-collab-body .collab-summary-body{padding:0!important}.atg-collab-body .collab-summary-foot{margin-top:28px!important;color:#577089!important}.atg-collab-body .summary-ref{display:none!important}.atg-collab-body .summary-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important}.atg-collab-body .summary-grid>div{padding:12px 13px!important;background:#f6f9fb!important;border:1px solid #d8e3ea!important;border-radius:10px!important;break-inside:avoid;page-break-inside:avoid}.atg-collab-body .summary-grid span{display:block!important;color:#6b8296!important;font-size:11px!important;text-transform:uppercase!important;letter-spacing:.05em!important}.atg-collab-body .summary-grid b{display:block!important;color:#173451!important;margin-top:4px!important}.atg-collab-body .summary-section{margin-top:24px!important;padding-top:20px!important;border-top:1px solid #d8e3ea!important;break-inside:avoid;page-break-inside:avoid}.atg-collab-body .summary-section h4{color:#173451!important;margin:0 0 8px!important}.atg-collab-body .summary-section p{color:#425d73!important}.atg-collab-body .pill{background:#eef5f8!important;border-color:#c5d7e2!important;color:#284d69!important}.atg-collab-body .summary-note{margin-top:24px!important;padding:14px 16px!important;background:#f3fbf9!important;border-left:4px solid #46a99f!important;color:#486a68!important}.atg-collab-pdf footer{padding:14px 52px;background:#102941;color:#c6d8e5;font-size:11px;letter-spacing:.04em}
    `;document.head.appendChild(st);
  }

  async function download(){
    if(ready.hidden){status('Prepare the Collaboration Profile first, then download the PDF.','error');return;}
    const old=button.textContent;button.disabled=true;button.textContent='Generating PDF…';let stage=null;
    try{
      const html2pdf=await ensureLibrary();ensureStyles();
      stage=document.createElement('div');stage.className='atg-network-pdf-stage';stage.setAttribute('aria-hidden','true');stage.appendChild(buildDocument());document.body.appendChild(stage);
      await html2pdf().set({margin:[7,7,9,7],filename:safeName('AliTechGrid_'+reference()+'_'+stamp())+'.pdf',image:{type:'jpeg',quality:.98},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff',logging:false,scrollX:0,scrollY:0,windowWidth:794},jsPDF:{unit:'mm',format:'a4',orientation:'portrait',compress:true},pagebreak:{mode:['css','legacy'],after:['.atg-collab-cover'],avoid:['.summary-grid>div','.summary-section']}}).from(stage).save();
      status('Collaboration Profile PDF generated successfully. Your form and summary remain on this page.','ok');
    }catch(err){console.error('AliTechGrid collaboration PDF export failed:',err);status('PDF generation failed. Your summary is preserved; use Email, WhatsApp or Copy as a fallback.','error');}
    finally{if(stage)stage.remove();button.disabled=false;button.textContent=old;}
  }

  button.textContent='Download Collaboration PDF';
  button.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();download();},true);
})();
