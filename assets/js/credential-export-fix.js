/* AliTechGrid Credential Studio — protected SAMPLE PDF export
   Public samples remain permanently marked SAMPLE · NOT VALID.
   This patch replaces the old window.print() action with a direct
   client-side PDF download while preserving the current page state.
*/
(function(){
  'use strict';

  const certificate=document.getElementById('certificate');
  const button=document.getElementById('print-sample');
  if(!certificate||!button)return;

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
      s.src=PDF_LIB;
      s.async=true;
      s.crossOrigin='anonymous';
      s.referrerPolicy='no-referrer';
      s.dataset.atgHtml2pdf='1';
      s.addEventListener('load',()=>typeof window.html2pdf==='function'?resolve(window.html2pdf):reject(new Error('PDF library unavailable.')),{once:true});
      s.addEventListener('error',()=>reject(new Error('PDF library failed to load.')),{once:true});
      document.head.appendChild(s);
    });
    return libraryPromise;
  }

  function notify(text,kind){
    document.querySelectorAll('.atg-cert-export-status').forEach(x=>x.remove());
    const n=document.createElement('div');
    n.className='atg-cert-export-status';
    n.setAttribute('role','status');
    n.textContent=text;
    Object.assign(n.style,{
      position:'fixed',right:'20px',bottom:'20px',zIndex:'10000',maxWidth:'390px',
      padding:'13px 16px',borderRadius:'12px',background:'#102941',color:'#eef6ff',
      border:'1px solid '+(kind==='error'?'#c65b6b':'#46a99f'),
      boxShadow:'0 16px 42px rgba(0,0,0,.32)',
      font:'700 .85rem/1.45 Inter,system-ui,-apple-system,"Segoe UI",sans-serif'
    });
    document.body.appendChild(n);
    setTimeout(()=>n.remove(),kind==='error'?6500:3200);
  }

  function safeName(v){
    return String(v||'Credential_Sample')
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g,'')
      .replace(/\s+/g,'_')
      .replace(/_+/g,'_')
      .slice(0,80);
  }

  function stamp(){
    const d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  function stageFor(clone){
    let st=document.getElementById('atg-cert-pdf-style');
    if(!st){
      st=document.createElement('style');
      st.id='atg-cert-pdf-style';
      st.textContent=`
        .atg-cert-pdf-stage{
          position:absolute!important;
          left:0!important;
          top:0!important;
          width:1122px!important;
          height:794px!important;
          background:#fff!important;
          z-index:-9999!important;
          pointer-events:none!important;
        }
        .atg-cert-pdf-stage .certificate{
          width:1122px!important;
          height:794px!important;
          max-width:none!important;
          aspect-ratio:auto!important;
          margin:0!important;
          box-shadow:none!important;
        }
      `;
      document.head.appendChild(st);
    }
    const stage=document.createElement('div');
    stage.className='atg-cert-pdf-stage';
    stage.setAttribute('aria-hidden','true');
    stage.appendChild(clone);
    document.body.appendChild(stage);
    return stage;
  }

  async function download(){
    const old=button.textContent;
    button.disabled=true;
    button.textContent='Generating SAMPLE PDF…';
    let stage=null;
    try{
      const html2pdf=await ensureLibrary();
      const clone=certificate.cloneNode(true);
      clone.removeAttribute('id');
      stage=stageFor(clone);

      const title=(document.getElementById('cert-title')||{}).textContent||'Credential Sample';
      const filename='AliTechGrid_SAMPLE_NOT_VALID_'+safeName(title)+'_'+stamp()+'.pdf';

      await html2pdf().set({
        margin:[4,4,4,4],
        filename,
        image:{type:'jpeg',quality:.99},
        html2canvas:{
          scale:2,
          useCORS:true,
          backgroundColor:'#ffffff',
          logging:false,
          scrollX:0,
          scrollY:0,
          windowWidth:1122
        },
        jsPDF:{
          unit:'mm',
          format:'a4',
          orientation:'landscape',
          compress:true
        },
        pagebreak:{mode:['css','legacy']}
      }).from(stage).save();

      notify('Protected SAMPLE PDF generated. It remains marked SAMPLE · NOT VALID.','ok');
    }catch(err){
      console.error('AliTechGrid credential SAMPLE PDF export failed:',err);
      notify('SAMPLE PDF generation failed. The certificate remains protected and no credential was issued.','error');
    }finally{
      if(stage)stage.remove();
      button.disabled=false;
      button.textContent=old;
    }
  }

  button.textContent='Download SAMPLE PDF';
  button.addEventListener('click',e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    download();
  },true);
})();
