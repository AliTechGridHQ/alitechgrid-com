(function(){
 const menuBtn=document.querySelector('[data-menu-button]'),nav=document.querySelector('[data-main-nav]');
 if(menuBtn&&nav) menuBtn.addEventListener('click',()=>{const o=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(o));});
 document.querySelectorAll('.nav-dropbtn').forEach(btn=>btn.addEventListener('click',()=>{const d=btn.closest('.nav-dropdown');const o=d.classList.toggle('open');btn.setAttribute('aria-expanded',String(o));}));
 document.addEventListener('click',e=>document.querySelectorAll('.nav-dropdown.open').forEach(d=>{if(!d.contains(e.target)){d.classList.remove('open');const b=d.querySelector('.nav-dropbtn');if(b)b.setAttribute('aria-expanded','false')}}));
 document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

 // Privacy-safe launch website guide: approved AliTechGrid content only; no external LLM calls.
 const helper=document.querySelector('[data-guide]'),hb=helper&&helper.querySelector('.helper-btn'),closeBtn=helper&&helper.querySelector('.guide-close'),messages=helper&&helper.querySelector('[data-guide-messages]'),form=helper&&helper.querySelector('[data-guide-form]'),input=helper&&helper.querySelector('[data-guide-input]');
 const routes={
   facultyos:{text:'FacultyOS supports faculty course production, student gap mitigation and management evidence. For a tailored demonstration, use the short FacultyOS demo request.',label:'Request FacultyOS Demo',href:'facultyos.html#request-demo'},
   training:{text:'AliTechGrid provides faculty, staff, leadership and technical capability development, including AI, automation, cloud and education-focused pathways.',label:'Explore Training',href:'training.html'},
   collaboration:{text:'Institutional collaboration can include proposed joint diplomas or certificates, faculty enablement, leadership development, Train-the-Trainer, Sovereign AI labs and applied research.',label:'Explore Collaboration',href:'collaboration.html'},
   network:{text:'The AliTechGrid AI Collaboration Network connects institutions and individual professionals across education, industry, technology, research and the public sector through privacy-conscious opportunity discovery and collaboration-role matching.',label:'Explore AI Collaboration Network',href:'network.html'},
   solution:{text:'The AI Solution Engine diagnoses priorities, compares Pilot / Strategic / Transform pathways, identifies gaps and produces a decision-oriented blueprint.',label:'Run AI Solution Engine',href:'ai-solution-engine.html'},
   sovereign:{text:'Sovereign AI options focus on control, privacy, data residency, governance, human authority and the right architecture for institutional risk.',label:'Explore Sovereign AI',href:'sovereign-ai.html'},
   credential:{text:'The public Credential Studio shows protected SAMPLE credentials only. Official issuance is intended for controlled, authenticated workflows with verification and auditability.',label:'View Credential Samples',href:'credential-studio.html'},
   consulting:{text:'Consulting covers AI strategy, readiness, governance, architecture, education transformation, implementation planning and institutional capability.',label:'Explore Consulting',href:'consulting.html'},
   contact:{text:'For institutional inquiries, you can contact AliTechGrid by email, business phone or WhatsApp. Initial inquiries should not contain sensitive data.',label:'Contact AliTechGrid',href:'contact.html'},
   default:{text:'I can guide you to FacultyOS, training, collaboration, the AI Collaboration Network, Sovereign AI, consulting, credentials or the AI Solution Engine. Try asking what you want to achieve.',label:'See Solutions',href:'solutions.html'}
 };
 function classify(q){q=q.toLowerCase();if(/facultyos|faculty|student gap|demo|course design|udl/.test(q))return 'facultyos';if(/train|leadership|staff|workshop|capacity|python|cloud/.test(q))return 'training';if(/network|ecosystem|matchmaking|partner match|partner directory|opportunity board|join as individual|individual professional|professional network/.test(q))return 'network';if(/collab|partner|diploma|joint|mou|memorandum|research/.test(q))return 'collaboration';if(/readiness|diagnos|blueprint|business case|feasibility|swot|solution engine|proposal/.test(q))return 'solution';if(/sovereign|private ai|privacy|residency|local ai|data control|governance/.test(q))return 'sovereign';if(/certificate|credential|verify|verification|appreciation|acknowledgement/.test(q))return 'credential';if(/consult|implement|strategy|advis|architecture/.test(q))return 'consulting';if(/contact|email|phone|whatsapp|meeting|call/.test(q))return 'contact';return 'default'}
 function addMessage(text,who,route){if(!messages)return;const d=document.createElement('div');d.className='guide-msg '+who+' guide-pulse';const s=document.createElement('span');s.textContent=text;d.appendChild(s);if(route&&route.href){const br=document.createElement('br');d.appendChild(br);const a=document.createElement('a');a.href=route.href;a.textContent=route.label+' →';d.appendChild(a)}messages.appendChild(d);messages.scrollTop=messages.scrollHeight}
 function answer(q){if(!q||!q.trim())return;addMessage(q.trim(),'user');const r=routes[classify(q)];window.setTimeout(()=>addMessage(r.text,'bot',r),120)}
 if(helper&&hb){hb.addEventListener('click',()=>{const o=helper.classList.toggle('open');hb.setAttribute('aria-expanded',String(o));if(o&&input)window.setTimeout(()=>input.focus(),80)});}
 if(closeBtn&&helper&&hb)closeBtn.addEventListener('click',()=>{helper.classList.remove('open');hb.setAttribute('aria-expanded','false')});
 if(helper)helper.querySelectorAll('[data-guide-query]').forEach(b=>b.addEventListener('click',()=>answer(b.getAttribute('data-guide-query')||b.textContent)));
 if(form&&input)form.addEventListener('submit',e=>{e.preventDefault();answer(input.value);input.value='';input.focus()});

 // FacultyOS privacy-first demo request: prepare locally, then hand off by user-selected channel.
 const demoForm=document.getElementById('facultyos-demo-form');
 if(demoForm){
   const ready=document.getElementById('demo-request-ready'),summaryEl=document.getElementById('demo-summary'),emailLink=document.getElementById('demo-email-link'),waLink=document.getElementById('demo-whatsapp-link'),copyBtn=document.getElementById('demo-copy');
   let latest='';
   demoForm.addEventListener('submit',e=>{
     e.preventDefault();
     if(!demoForm.reportValidity())return;
     const fd=new FormData(demoForm),get=k=>(fd.get(k)||'').toString().trim();
     latest=[
       'FacultyOS Demo Request',
       '',
       'Name: '+get('name'),
       'Work email: '+get('email'),
       'Organization: '+get('organization'),
       'Role: '+(get('role')||'Not provided'),
       'Organization type: '+get('type'),
       'Primary demo focus: '+get('focus'),
       'Approximate pilot scale: '+get('scale'),
       'Current LMS / environment: '+(get('lms')||'Not provided'),
       '',
       'What would make the demo useful:',
       get('notes')||'Not provided',
       '',
       'Privacy note: No sensitive information is intended to be included in this initial request.'
     ].join('\n');
     const subject='FacultyOS Demo Request — '+get('organization');
     if(summaryEl)summaryEl.textContent=latest;
     if(emailLink)emailLink.href='mailto:contact@alitechgrid.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(latest);
     if(waLink)waLink.href='https://wa.me/16726719982?text='+encodeURIComponent(latest);
     if(ready){ready.hidden=false;ready.scrollIntoView({behavior:'smooth',block:'nearest'})}
   });
   if(copyBtn)copyBtn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(latest);const old=copyBtn.textContent;copyBtn.textContent='Copied';window.setTimeout(()=>copyBtn.textContent=old,1600)}catch(_){copyBtn.textContent='Select text below to copy'}});
 }

 // Production-only analytics. No analytics network request during local preview.
 const host=location.hostname.toLowerCase();
 if(host==='alitechgrid.com'||host==='www.alitechgrid.com'){
   const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-GQZFT2RKFQ';document.head.appendChild(s);
   window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','G-GQZFT2RKFQ',{anonymize_ip:true});
 }
})();
