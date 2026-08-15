(function(){
  const safe=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const matchForm=document.getElementById('network-match-form');
  const output=document.getElementById('network-match-output');
  const roleLabels={academic:'Academic / awarding institution',curriculum:'Curriculum & capability specialist',technology:'Technology / infrastructure provider',industry:'Industry / applied-project contributor',research:'Research & evaluation contributor',market:'Recruitment / workforce-access contributor',funding:'Funding / sponsorship contributor',governance:'Governance / legal / privacy review',expert:'Independent subject-matter expert / mentor'};
  const configs={credential:['academic','curriculum','industry','technology'],training:['curriculum','academic','industry','expert'],lab:['technology','academic','research','governance'],research:['research','academic','industry','technology','expert'],industry:['industry','academic','curriculum','expert'],implementation:['technology','industry','governance','curriculum','expert'],facultyos:['academic','curriculum','technology','research'],other:['academic','curriculum','industry','technology','expert']};
  function strengthRole(v){return {academic:'academic',curriculum:'curriculum',technology:'technology',industry:'industry',research:'research',market:'market',funding:'funding',other:''}[v]||''}
  if(matchForm&&output){matchForm.addEventListener('submit',e=>{e.preventDefault();if(!matchForm.reportValidity())return;const fd=new FormData(matchForm),goal=fd.get('goal'),owned=strengthRole(fd.get('strength'));let roles=[...(configs[goal]||configs.other)];if(owned)roles=roles.filter(r=>r!==owned);if(fd.get('org')==='individual'&&goal==='credential'&&!roles.includes('academic'))roles.unshift('academic');if(!roles.length)roles=['academic','curriculum','industry'];const region=fd.get('region');const governance=(['credential','lab','research'].includes(goal))?'Define approval, IP, privacy/data and decision rights before execution.':'Define scope, owners, evidence, privacy boundaries and success measures before execution.';output.innerHTML=`<span class="tag">AI collaboration preview</span><h3>Recommended collaboration architecture</h3><p>Your stated contribution is <b>${safe(String(fd.get('strength')).replaceAll('-',' '))}</b>. Useful complementary roles may include:</p><div class="match-role-list">${roles.slice(0,4).map((r,i)=>`<div><span>${i+1}</span><b>${safe(roleLabels[r])}</b></div>`).join('')}</div><div class="match-insight"><b>Reach:</b> ${safe(region==='both'?'Canada + international':String(region).replaceAll('-',' '))}<br><b>Governance gate:</b> ${safe(governance)}<br><b>Recommended next action:</b> Prepare a Collaboration Profile so AliTechGrid can review the opportunity and discuss suitable next steps.</div><a class="btn btn-primary" href="#join-network">Prepare Collaboration Profile</a>`;output.scrollIntoView({behavior:'smooth',block:'nearest'});});}

  const joinForm=document.getElementById('network-join-form');
  const kind=document.getElementById('join-kind');
  const org=document.getElementById('join-org');
  const orgReq=document.getElementById('join-org-required');
  const orgTypeField=document.getElementById('join-org-type-field');
  const profileField=document.getElementById('join-profile-field');
  const orgType=document.getElementById('join-type');
  const profile=document.getElementById('join-profile');
  const orgCopy=document.querySelector('[data-org-copy]');
  const indCopy=document.querySelector('[data-ind-copy]');
  const joinChoiceBtns=[...document.querySelectorAll('.join-choice-btn[data-join-preset]')];

  function setKind(value){
    if(!kind)return;
    kind.value=value==='individual'?'individual':'organization';
    const individual=kind.value==='individual';
    if(org){org.required=!individual;org.placeholder=individual?'Current organization / institution (optional)':'';}
    if(orgReq)orgReq.hidden=individual;
    if(orgTypeField)orgTypeField.hidden=individual;
    if(profileField)profileField.hidden=!individual;
    if(orgType){orgType.required=!individual;if(individual)orgType.value='';}
    if(profile){profile.required=individual;if(!individual)profile.value='';}
    if(orgCopy)orgCopy.hidden=individual;
    if(indCopy)indCopy.hidden=!individual;
    joinChoiceBtns.forEach(b=>b.classList.toggle('active',b.dataset.joinPreset===kind.value));
  }
  if(kind){kind.addEventListener('change',()=>setKind(kind.value));setKind(kind.value);}
  document.querySelectorAll('[data-join-preset]').forEach(el=>el.addEventListener('click',()=>{setKind(el.dataset.joinPreset);setTimeout(()=>joinForm&&joinForm.scrollIntoView({behavior:'smooth',block:'start'}),50);}));

  function refId(){const d=new Date();const yy=d.getFullYear();const mm=String(d.getMonth()+1).padStart(2,'0');const dd=String(d.getDate()).padStart(2,'0');const rnd=Math.random().toString(36).slice(2,6).toUpperCase();return `ATG-COL-${yy}${mm}${dd}-${rnd}`;}
  function classify(interest){const s=(interest||'').toLowerCase();if(/faculty|staff|leadership training/.test(s))return ['Training & Capability','AI Solution Engine'];if(/facultyos|education transformation/.test(s))return ['FacultyOS','Education AI','AI Solution Engine'];if(/diploma|certificate|micro-credential/.test(s))return ['Institutional Collaboration','Training & Capability','AI Solution Engine'];if(/research|innovation/.test(s))return ['Applied Research Collaboration','Research & Standards','Sovereign AI'];if(/lab|centre/.test(s))return ['Sovereign AI','Consulting & Implementation','Institutional Collaboration'];if(/implementation|automation/.test(s))return ['Consulting & Implementation','Sovereign AI','AI Solution Engine'];if(/technology|platform/.test(s))return ['Sovereign AI','Consulting & Implementation','Collaboration'];if(/industry|employability/.test(s))return ['Industry Collaboration','Training & Capability','AI Solution Engine'];return ['AI Solution Engine','Collaboration','Consulting & Implementation'];}

  if(joinForm){
    const ready=document.getElementById('network-request-ready'),summary=document.getElementById('network-request-summary'),email=document.getElementById('network-email-link'),wa=document.getElementById('network-whatsapp-link'),copy=document.getElementById('network-copy'),printBtn=document.getElementById('network-print');let latest='';let reference='';
    joinForm.addEventListener('submit',e=>{
      e.preventDefault();if(!joinForm.reportValidity())return;
      const fd=new FormData(joinForm),get=k=>(fd.get(k)||'').toString().trim();const individual=get('kind')==='individual';
      const affiliation=get('organization')||'Not provided';const category=individual?get('profile'):get('type');const paths=classify(get('interest'));reference=refId();
      const nextStep=individual?'AliTechGrid review → relevant collaboration discussion if there is a fit.':'AliTechGrid review → discovery meeting or deeper AI Solution Engine assessment when appropriate.';
      const rows=[
        ['Request reference',reference],['Profile type',individual?'Individual Professional':'Organization'],['Name',get('name')],['Email',get('email')],['Country / region',get('country')],[individual?'Organization / affiliation':'Organization',affiliation],['Role / title',get('role')||'Not provided'],[individual?'Professional profile':'Organization type',category],['Primary interest',get('interest')],['Preferred follow-up',get('contact_method')],['Phone / WhatsApp',get('phone')||'Not provided']
      ];
      if(summary){summary.innerHTML=`<div class="summary-ref">${safe(reference)}</div><div class="summary-grid">${rows.map(r=>`<div><span>${safe(r[0])}</span><b>${safe(r[1])}</b></div>`).join('')}</div><div class="summary-section"><h4>What you can contribute</h4><p>${safe(get('contribute')||'Not provided')}</p></div><div class="summary-section"><h4>What you are looking for</h4><p>${safe(get('need'))}</p></div><div class="summary-section"><h4>Preliminary AliTechGrid pathway</h4><div class="pill-row">${paths.map(x=>`<span class="pill">${safe(x)}</span>`).join('')}</div><p><b>Recommended next step:</b> ${safe(nextStep)}</p></div><div class="summary-note">This locally prepared summary is an expression of interest only. It does not create formal affiliation, accreditation, endorsement, employment, agency, partnership or contractual status.</div>`;}
      latest=['AliTechGrid AI Collaboration Network','Collaboration Profile & Opportunity Summary','',`Request reference: ${reference}`,`Profile type: ${individual?'Individual Professional':'Organization'}`,`Name: ${get('name')}`,`Email: ${get('email')}`,`Country / region: ${get('country')}`,`${individual?'Organization / affiliation':'Organization'}: ${affiliation}`,`Role / title: ${get('role')||'Not provided'}`,`${individual?'Professional profile':'Organization type'}: ${category}`,`Primary collaboration interest: ${get('interest')}`,`Preferred follow-up: ${get('contact_method')}`,`Phone / WhatsApp: ${get('phone')||'Not provided'}`,'',individual?'What I can contribute:':'What our organization can contribute:',get('contribute')||'Not provided','','What I am / we are looking for:',get('need'),'','Preliminary AliTechGrid pathway: '+paths.join(' · '),'Recommended next step: '+nextStep,'','Acknowledgement: This is an expression of interest only. It does not create formal affiliation, accreditation, endorsement, employment, agency, partnership or contractual status.','Privacy: This public form did not automatically upload or store the entered information on an AliTechGrid web database.'].join('\n');
      const subject=`AliTechGrid Collaboration Request ${reference} — ${individual?get('name'):(get('organization')||get('name'))}`;
      if(email)email.href='mailto:contact@alitechgrid.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(latest);
      if(wa)wa.href='https://wa.me/16726719982?text='+encodeURIComponent(latest);
      if(ready){ready.hidden=false;ready.scrollIntoView({behavior:'smooth',block:'nearest'});}
    });
    if(copy)copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(latest);const old=copy.textContent;copy.textContent='Copied';setTimeout(()=>copy.textContent=old,1600);}catch(_){copy.textContent='Select summary to copy';}});
    if(printBtn)printBtn.addEventListener('click',()=>window.print());
  }
})();
