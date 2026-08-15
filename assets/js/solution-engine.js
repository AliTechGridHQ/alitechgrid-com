(function(){
  const form=document.getElementById('solution-engine');
  if(!form)return;
  const steps=[...document.querySelectorAll('.engine-step')];
  const chips=[...document.querySelectorAll('.step-chip')];
  const bar=document.querySelector('.progress span');
  const state={};
  let current=0;
  let lastResult=null;

  function radioValue(name){
    const el=form.querySelector('input[name="'+name+'"]:checked');
    return el?el.value:'';
  }
  function readStep(){
    steps[current].querySelectorAll('input,select,textarea').forEach(el=>{
      if(el.type==='radio'){
        if(el.checked)state[el.name]=el.value;
      }else if(el.type!=='button'){
        state[el.name]=el.value;
      }
    });
  }
  function valid(){
    const req=[...steps[current].querySelectorAll('[required]')];
    for(const el of req){
      if(el.type==='radio'){
        if(!radioValue(el.name))return false;
      }else if(!el.value.trim())return false;
    }
    return true;
  }
  function update(){
    steps.forEach((s,i)=>s.hidden=i!==current);
    chips.forEach((c,i)=>{c.className='step-chip'+(i<current?' done':i===current?' current':'')});
    bar.style.width=((current+1)/steps.length*100)+'%';
    document.getElementById('back-btn').style.visibility=current?'visible':'hidden';
    document.getElementById('next-btn').textContent=current===steps.length-1?'Generate Blueprint':'Continue';
  }
  function score(base,boosts){
    let s=base;
    boosts.forEach(b=>s+=b);
    return Math.max(18,Math.min(92,Math.round(s)));
  }
  function safe(value){
    return String(value??'').replace(/[&<>"']/g,ch=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[ch]);
  }
  function gapText(g,org){
    return {
      Strategy:'Clarify priority use cases, ownership, decision gates and measurable value before scaling.',
      Governance:'Strengthen policy, privacy, risk controls, approval, auditability and AI-use boundaries.',
      People:'Build role-specific capability for leaders, faculty/staff, technical teams and users.',
      Technology:'Validate integration, identity, model access, data architecture, security and operating model.',
      'Learning & Evidence':(org==='business'||org==='government')
        ?'Define evidence of workforce capability, service improvement and operational value.'
        :'Connect AI use to learning outcomes, assessment integrity, accessibility, intervention evidence and faculty workload.'
    }[g];
  }
  function scenarios(org,privacy){
    const pilot=`<div class="scenario"><span class="tag">Pilot</span><h3>Controlled Start</h3><p>6–10 week proof of value focused on one high-value use case.</p><ul><li>Readiness validation</li><li>Governance guardrails</li><li>Small user cohort</li><li>Baseline + outcome metrics</li></ul></div>`;
    const strategic=`<div class="scenario recommended"><span class="tag">Recommended</span><h3>Strategic Pathway</h3><p>12–24 week capability build combining solution, people, evidence and governance.</p><ul><li>Adaptive implementation roadmap</li><li>${privacy==='strict'?'Sovereign/private AI design':'Controlled enterprise AI design'}</li><li>${['university','college','school','training'].includes(org)?'Faculty/staff enablement + FacultyOS':'Leadership + workforce enablement'}</li><li>Decision dashboard + KPIs</li></ul></div>`;
    const transform=`<div class="scenario"><span class="tag">Transform</span><h3>Institution-wide Scale</h3><p>Multi-phase operating model for integrated AI capability.</p><ul><li>Portfolio governance</li><li>Platform + integration architecture</li><li>Capability academy</li><li>Continuous evaluation and optimization</li></ul></div>`;
    return pilot+strategic+transform;
  }
  function swot(org,gaps){
    const strengths=['Clear interest in AI-enabled improvement',state.executive==='yes'?'Executive sponsorship indicated':'Opportunity to establish leadership sponsorship'];
    const weaknesses=gaps.map(g=>g+' maturity requires strengthening');
    const opportunities=['Use AI to reduce repetitive work and improve decision support',(['university','college','school','training'].includes(org)?'Modernize learning, faculty capability and institutional collaboration':'Build role-specific AI and automation capability')];
    const threats=['Uncontrolled AI use, privacy leakage or weak governance','Scaling before evidence, adoption and operating ownership are proven'];
    const block=(title,items)=>`<div><h4>${title}</h4>${items.map(x=>`<p>• ${safe(x)}</p>`).join('')}</div>`;
    return block('Strengths',strengths)+block('Weaknesses',weaknesses)+block('Opportunities',opportunities)+block('Threats',threats);
  }
  function roadmap(gaps){
    return `<div><b>0–30 days</b><p>Validate use case, stakeholders, baseline metrics, data boundaries and governance. Confirm ${safe(gaps[0])} improvement actions.</p></div><div><b>31–60 days</b><p>Configure pilot, train users, run controlled workflows and collect evidence. Review risk and adoption weekly.</p></div><div><b>61–90 days</b><p>Evaluate outcomes, compare against baseline, decide scale / revise / stop, and prepare business case or partnership package.</p></div>`;
  }
  function kpis(org){
    const a=['Adoption','Time saved','Quality','Risk incidents','User confidence'];
    if(['university','college','school','training'].includes(org))a.push('Learning evidence','Faculty workload','Intervention effectiveness');
    else a.push('Process cycle time','Service value');
    return a;
  }
  function documents(org,collab,goal){
    const d=['Executive AI Opportunity Report','Implementation Roadmap','Business Case'];
    if(['university','college','training'].includes(org)&&collab==='credential')d.push('Credential Feasibility Study','Partnership Proposal','Draft MoU');
    else if(['university','college','school','training'].includes(org))d.push('Academic Collaboration Proposal','Faculty Development Plan');
    if(goal==='strategy')d.push('Leadership Decision Brief');
    return d;
  }
  function bullets(items){
    return `<ul>${items.map(x=>`<li>${safe(x)}</li>`).join('')}</ul>`;
  }
  function docHeader(title,r){
    const orgName=(r.orgName||'').trim()||r.orgLabel;
    const initiative=(r.initiativeName||'').trim()||'AI Capability Initiative';
    const today=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'long',day:'numeric'}).format(new Date());
    return `<article class="decision-doc"><section class="decision-cover"><div class="decision-brand"><img src="assets/img/alitechgrid-logo.svg" alt="AliTechGrid"><span>AI Solution Intelligence</span></div><div class="decision-kicker">Decision Intelligence · Strategy · Feasibility · Implementation</div><h1>${safe(title)}</h1><p class="decision-subtitle">Prepared for <b>${safe(orgName)}</b></p><div class="decision-meta"><div><span>Initiative</span><b>${safe(initiative)}</b></div><div><span>Readiness</span><b>${r.overall}/100</b></div><div><span>Scope</span><b>${safe(r.scale.replaceAll('-',' '))}</b></div><div><span>Prepared</span><b>${safe(today)}</b></div></div><div class="decision-cover-note">Generated from the AliTechGrid adaptive diagnostic. This document is designed as a high-quality management working output. Validate organization-specific facts, financial assumptions, legal terms, accreditation, privacy, security and executive approvals before formal adoption or signature.</div></section><section class="decision-body"><div class="decision-summary-strip"><div><span>Organization profile</span><b>${safe(r.orgLabel)} · ${safe(r.maturity)} AI stage</b></div><div><span>Priority gaps</span><b>${r.gaps.map(safe).join(' · ')}</b></div><div><span>Architecture direction</span><b>${safe(r.privacyRec)}</b></div></div>`;
  }
  function docFooter(r){
    return `<section class="decision-final"><h3>Decision integrity & next step</h3><p>This output should support management discussion, discovery and planning. Where the document is intended for formal procurement, accreditation, investment approval, partnership execution or legal signature, request an AliTechGrid expert review and validate all organization-specific evidence.</p><div class="decision-final-grid"><div><span>Recommended next action</span><b>Validate assumptions → confirm owners → approve pilot/feasibility gate</b></div><div><span>Prepared by</span><b>AliTechGrid AI Solution Intelligence</b></div></div></section></section><footer class="decision-doc-footer"><span>AliTechGrid · Sovereign AI · Education · Innovation</span><span>Professional working document · Human validation required</span></footer></article>`;
  }

  function generate(){
    readStep();
    const org=state.org||'other';
    const goal=state.goal||'strategy';
    const maturity=state.maturity||'exploring';
    const privacy=state.privacy||'balanced';
    const scale=state.scale||'department';
    const challenge=state.challenge||'skills';
    const collab=state.collaboration||'open';
    const maturityBase={exploring:34,pilot:50,operational:66,scaling:78}[maturity]||42;
    const strategy=score(maturityBase,[goal==='strategy'?12:0,state.executive==='yes'?8:-2]);
    const governance=score(maturityBase-5,[privacy==='strict'?14:privacy==='balanced'?7:1,state.governance==='formal'?12:state.governance==='partial'?4:-4]);
    const people=score(maturityBase,[challenge==='skills'?3:0,state.faculty==='strong'?13:state.faculty==='mixed'?4:-5]);
    const technology=score(maturityBase+3,[state.infrastructure==='ready'?12:state.infrastructure==='partial'?4:-5,privacy==='strict'?-1:3]);
    const pedagogy=score((org==='business'||org==='government')?maturityBase:maturityBase-3,[goal==='learning'?15:0,state.learningEvidence==='strong'?10:state.learningEvidence==='some'?3:-4]);
    const scores={Strategy:strategy,Governance:governance,People:people,Technology:technology,'Learning & Evidence':pedagogy};
    const overall=Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.keys(scores).length);
    const sorted=Object.entries(scores).sort((a,b)=>a[1]-b[1]);
    const gaps=sorted.slice(0,3).map(x=>x[0]);
    const orgLabel={university:'University',college:'College / Polytechnic',school:'School / K–12',training:'Training organization',government:'Government / public sector',business:'Business / industry',other:'Organization'}[org]||'Organization';
    const privacyRec=privacy==='strict'
      ?'Private / sovereign AI architecture with Canadian-controlled data, model gateway, audit and human approval.'
      :privacy==='balanced'
        ?'Hybrid architecture: controlled enterprise AI with protected-data boundaries and human approval.'
        :'Cloud-first AI with governance controls; keep sensitive workloads separated.';
    let collabRec='Targeted advisory, readiness and implementation support.';
    if(['university','college','training'].includes(org)){
      if(collab==='credential')collabRec='Proposed joint AI & Automation credential pathway, faculty Train-the-Trainer, curriculum feasibility and lab capability design.';
      else if(collab==='faculty')collabRec='Faculty and staff AI capability program, leadership enablement and FacultyOS pilot.';
      else if(collab==='lab')collabRec='Sovereign AI Lab / Centre collaboration with governance, applied research and faculty enablement.';
      else collabRec='Academic collaboration pathway combining curriculum modernization, faculty development and a controlled AI pilot.';
    }else if(org==='business')collabRec='Workforce AI capability, automation opportunity mapping and leadership transformation program.';
    else if(org==='government')collabRec='Public-sector AI readiness, governance, workforce capability and controlled proof-of-value program.';

    document.getElementById('result-title').textContent=orgLabel+' AI Solution Blueprint';
    document.getElementById('overall-score').textContent=overall+'/100';
    document.getElementById('score-grid').innerHTML=Object.entries(scores).map(([k,v])=>`<div class="score-box"><strong>${v}</strong><span>${safe(k)}</span></div>`).join('');
    document.getElementById('gap-list').innerHTML=gaps.map((g,i)=>`<div class="check"><div><b>${i+1}. ${safe(g)}</b><div>${safe(gapText(g,org))}</div></div></div>`).join('');
    document.getElementById('reasoning').textContent=`Your ${orgLabel.toLowerCase()} is currently at a ${maturity} AI stage. The engine prioritized ${gaps.join(', ')} because of the selected goal (${goal.replaceAll('-',' ')}), privacy posture (${privacy}) and primary challenge (${challenge.replaceAll('-',' ')}). Recommendations below are generated from transparent AliTechGrid decision rules; assumptions should be validated before procurement or formal approval.`;
    document.getElementById('architecture-rec').textContent=privacyRec;
    document.getElementById('collaboration-rec').textContent=collabRec;
    document.getElementById('scenario-grid').innerHTML=scenarios(org,privacy);
    document.getElementById('swot-grid').innerHTML=swot(org,gaps);
    document.getElementById('roadmap').innerHTML=roadmap(gaps);
    document.getElementById('kpis').innerHTML=kpis(org).map(x=>`<span class="pill">${safe(x)}</span>`).join(' ');
    document.getElementById('documents').innerHTML=documents(org,collab,goal).map(x=>`<span class="pill">${safe(x)}</span>`).join(' ');
    document.getElementById('assumptions').textContent=`Planning assumptions: ${scale.replaceAll('-',' ')} scope; no sensitive data was collected by this public engine; costs, accreditation, legal terms, staffing and integration requirements remain subject to institutional validation.`;
    lastResult={org,orgLabel,orgName:state.orgName||'',initiativeName:state.initiativeName||'',context:state.context||'',goal,maturity,privacy,scale,challenge,collab,collabRec,privacyRec,overall,gaps,scores};
    document.getElementById('engine-form-wrap').style.display='none';
    document.getElementById('engine-result').classList.add('show');
    window.scrollTo({top:document.getElementById('engine-result').offsetTop-90,behavior:'smooth'});
    const qs=new URLSearchParams({
      subject:'AliTechGrid AI Solution Blueprint review',
      body:`Hello AliTechGrid,\n\nI completed the AI Solution Engine.\nOrganization type: ${orgLabel}\nAI readiness score: ${overall}/100\nPriority gaps: ${gaps.join(', ')}\nRecommended collaboration: ${collabRec}\n\nI would like to discuss next steps.`
    });
    document.getElementById('email-result').href='mailto:contact@alitechgrid.com?'+qs.toString();
  }

  function generateDocument(){
    if(!lastResult)return;
    const r=lastResult;
    const type=document.getElementById('doc-type').value;
    let html='';
    if(type==='comprehensive'){
      html=docHeader('Comprehensive AI Strategy & Feasibility Report',r)+
      `<h2>Executive decision summary</h2><p>The diagnostic places the organization at a <b>${safe(r.maturity)}</b> AI stage with an overall readiness score of <b>${r.overall}/100</b>. The immediate priorities are ${r.gaps.map(safe).join(', ')}. The recommended approach is to validate a controlled strategic pathway before institution-wide scale.</p>`+
      `<h3>1. Strategic context & opportunity</h3><p>Primary objective: ${safe(r.goal.replaceAll('-',' '))}. The organization should focus on measurable value, accountable ownership, responsible data use and capability transfer rather than broad technology adoption without evidence.</p>`+
      `<h3>2. Readiness & gap analysis</h3>${bullets(Object.entries(r.scores).map(([k,v])=>`${k}: ${v}/100`))}${bullets(r.gaps.map(g=>`${g}: ${gapText(g,r.org)}`))}`+
      `<h3>3. Recommended solution architecture</h3><p>${safe(r.privacyRec)}</p>${bullets(['Identity and access controls appropriate to risk','Approved data boundaries and retention rules','Human approval for consequential decisions','Audit logging, testing and change control','Model/vendor lifecycle and fallback planning'])}`+
      `<h3>4. People, training & operating capability</h3>${bullets(['Leadership: strategy, governance, ROI and decision accountability','Faculty/staff/workforce: role-specific AI literacy and workflow capability','Technical teams: architecture, integration, security and operations','Train-the-Trainer: internal capability transfer and sustainability'])}`+
      `<h3>5. Collaboration / program opportunity</h3><p>${safe(r.collabRec)}</p>`+
      `<h3>6. SWOT analysis</h3><table class="decision-table"><thead><tr><th>Strengths</th><th>Weaknesses</th><th>Opportunities</th><th>Threats</th></tr></thead><tbody><tr><td>Visible AI ambition; opportunity to build coordinated capability.</td><td>${safe(r.gaps[0])} and related maturity require structured development.</td><td>Productivity, learning/service quality, differentiated programs and controlled innovation.</td><td>Privacy leakage, fragmented adoption, premature scale and unsupported claims.</td></tr></tbody></table>`+
      `<h3>7. Risk & governance register</h3><table class="decision-table"><thead><tr><th>Risk</th><th>Control</th><th>Decision evidence</th></tr></thead><tbody><tr><td>Protected-data exposure</td><td>Data classification, access control, approved architecture</td><td>Security/privacy approval</td></tr><tr><td>Low adoption/capability</td><td>Role training, champions, workflow redesign</td><td>Usage + competency evidence</td></tr><tr><td>Weak business/learning value</td><td>Baseline, KPI plan, pilot decision gates</td><td>Outcome comparison</td></tr><tr><td>Vendor/model dependency</td><td>Architecture abstraction, exit/fallback plan</td><td>Lifecycle review</td></tr></tbody></table>`+
      `<h3>8. Financial & feasibility framework</h3><p>Validate low/base/high scenarios for platform/model usage, integration, security, staffing, training, change management, support and internal time. Savings or revenue assumptions should be supported by measured baseline evidence rather than generic AI productivity claims.</p>`+
      `<h3>9. 90-day roadmap</h3>${bullets(['Days 0–30 — validate use case, baseline, stakeholders, data boundaries, governance and success criteria','Days 31–60 — configure controlled workflow, enable users, operate pilot and collect evidence','Days 61–90 — evaluate outcomes, cost, adoption and risk; decide scale, revise or stop'])}`+
      `<h3>10. KPI framework</h3>${bullets(kpis(r.org))}`+
      `<h3>11. Preliminary decision</h3><p><b>Conditional GO:</b> proceed to a controlled pilot/feasibility stage provided ownership, data boundaries, success measures and review authority are confirmed.</p>`;
    }else if(type==='businessplan'){
      html=docHeader('AI Initiative Business Plan',r)+
      `<h2>Executive summary</h2><p>This business plan converts the diagnostic into a structured operating concept for a staged AI initiative. It intentionally avoids invented market, revenue or ROI figures; those values must be validated against the organization's own evidence.</p>`+
      `<h3>1. Need / customer problem</h3><p>Primary objective: ${safe(r.goal.replaceAll('-',' '))}. Priority gaps: ${r.gaps.map(safe).join(', ')}.</p>`+
      `<h3>2. Proposed value proposition</h3>${bullets(['Solve a defined high-value workflow or learning/service problem','Improve quality, consistency and decision support','Build internal capability rather than dependency on isolated tools','Protect trust through governance, privacy and human authority'])}`+
      `<h3>3. Target users & stakeholders</h3>${bullets(['Executive sponsor and accountable owner','Primary faculty/staff/workforce user group','IT/security/data stakeholders','Quality, privacy, legal or academic governance stakeholders','Learners/customers/citizens where applicable'])}`+
      `<h3>4. Solution & delivery model</h3><p>${safe(r.privacyRec)}</p><p>Recommended collaboration: ${safe(r.collabRec)}</p>`+
      `<h3>5. Operating model</h3>${bullets(['Governance and decision rights','Service/product owner','AI/model operations and support','Training and capability transfer','Evidence, audit and continuous improvement'])}`+
      `<h3>6. Market / demand validation</h3><p>Validate stakeholder demand, competing/internal alternatives, willingness to adopt/pay where relevant, workforce or learner demand, and any regulatory/accreditation requirements. External market data should be sourced and cited during expert finalization.</p>`+
      `<h3>7. SWOT</h3><table class="decision-table"><thead><tr><th>Strength</th><th>Weakness</th><th>Opportunity</th><th>Threat</th></tr></thead><tbody><tr><td>Clear AI opportunity and staged implementation model</td><td>${safe(r.gaps[0])} requires improvement</td><td>Capability, service, program or productivity differentiation</td><td>Governance failure, weak adoption, premature scale</td></tr></tbody></table>`+
      `<h3>8. Financial model</h3><table class="decision-table"><thead><tr><th>Cost area</th><th>Low / Pilot</th><th>Base / Strategic</th><th>Transform</th></tr></thead><tbody><tr><td>Platform/model</td><td>Validate</td><td>Validate</td><td>Validate</td></tr><tr><td>Integration/security</td><td>Validate</td><td>Validate</td><td>Validate</td></tr><tr><td>Training/change</td><td>Validate</td><td>Validate</td><td>Validate</td></tr><tr><td>Operations/support</td><td>Validate</td><td>Validate</td><td>Validate</td></tr></tbody></table>`+
      `<h3>9. Revenue / value scenarios</h3><p>Use measured productivity, service quality, learner/program demand, cost avoidance or revenue evidence appropriate to the initiative. Do not present unvalidated estimates as guaranteed savings or income.</p>`+
      `<h3>10. Implementation & milestones</h3>${bullets(['Discovery and baseline','Solution design and approvals','Controlled pilot','Evaluation and business decision','Scale only after evidence'])}`+
      `<h3>11. KPIs</h3>${bullets(kpis(r.org))}`+
      `<h3>12. Decision request</h3><p>Approve a bounded feasibility/pilot phase with named owners, budget validation, governance controls and a 90-day evidence gate.</p>`;
    }else if(type==='business'){
      html=docHeader('Business Case — '+r.orgLabel+' AI Capability Initiative',r)+
      `<h3>1. Executive summary</h3><p>The diagnostic indicates a ${safe(r.maturity)} AI environment with priority gaps in ${r.gaps.map(safe).join(', ')}. The recommended direction is a staged strategic pathway rather than immediate institution-wide scale.</p>`+
      `<h3>2. Case for change</h3>${bullets(['Reduce unmanaged AI adoption and duplicated experimentation','Build role-specific capability and accountable ownership','Create measurable value while protecting data and institutional trust','Move from isolated tools to a governed operating model'])}`+
      `<h3>3. Options considered</h3>${bullets(['Option A — Controlled pilot: fastest proof with limited scope','Option B — Strategic pathway: recommended balance of capability, governance and evidence','Option C — Transform: institution-wide operating model after proof'])}`+
      `<h3>4. Recommended option</h3><p>Option B is recommended, beginning with a controlled proof of value and explicit decision gates. Architecture direction: ${safe(r.privacyRec)}</p>`+
      `<h3>5. Expected benefits</h3>${bullets(['Time and workload reduction in targeted workflows','Improved quality, consistency and user confidence','Stronger governance, privacy and auditability','Evidence for a defensible scale / revise / stop decision'])}`+
      `<h3>6. Cost & financial assumptions</h3><p>Costs must be validated for platform/model usage, integration, security, training, change management, support and internal staff time. Do not calculate ROI from unvalidated productivity assumptions.</p>`+
      `<h3>7. Key risks</h3>${bullets(['Privacy or confidential-data leakage','Low adoption or insufficient user capability','Scaling before evidence is established','Vendor/model dependency and lifecycle change','Unclear ownership or decision authority'])}`+
      `<h3>8. KPIs</h3>${bullets(kpis(r.org))}`+
      `<h3>9. 90-day decision plan</h3><p>Days 0–30: validate baseline, use case, data boundaries and governance. Days 31–60: run the controlled workflow and collect evidence. Days 61–90: evaluate outcomes, cost, risk and adoption; decide scale, revise or stop.</p>`;
    }else if(type==='feasibility'){
      html=docHeader('Feasibility Study — '+(r.collab==='credential'?'Proposed AI & Automation Credential':'AI Capability Initiative'),r)+
      `<h3>1. Opportunity</h3><p>Assess whether the proposed initiative is academically/operationally useful, technically feasible, governable and sustainable for the organization.</p>`+
      `<h3>2. Strategic fit</h3><p>Primary goal: ${safe(r.goal.replaceAll('-',' '))}. Recommended collaboration: ${safe(r.collabRec)}</p>`+
      `<h3>3. Readiness & gap analysis</h3>${bullets(r.gaps.map(g=>'Priority capability to validate: '+g))}`+
      `<h3>4. Academic / service feasibility</h3>${bullets(['Define target learner/user profile and measurable outcomes','Validate demand and stakeholder need','Confirm curriculum/service scope and delivery model','Confirm faculty/staff capacity and Train-the-Trainer requirements','Map assessment, quality assurance and approval dependencies'])}`+
      `<h3>5. Technical feasibility</h3><p>${safe(r.privacyRec)} Validate identity, data, LMS/business systems, APIs, model access, logging, security and support responsibilities.</p>`+
      `<h3>6. Governance & privacy</h3>${bullets(['Data classification and residency','Human authority and approval points','AI risk tiers and acceptable-use boundaries','Audit and incident handling','Academic integrity / quality controls where applicable'])}`+
      `<h3>7. SWOT</h3><p>Strength: clear opportunity to build institutional AI capability. Weakness: ${safe(r.gaps[0])} requires strengthening. Opportunity: develop scalable capability and differentiated programs/services. Threat: premature scaling, weak governance or unsupported claims.</p>`+
      `<h3>8. Financial feasibility</h3><p>Build low/base/high scenarios for staffing, curriculum/design, infrastructure, model/platform use, labs, training, marketing/recruitment where applicable, support and ongoing operations. Revenue or savings assumptions require evidence.</p>`+
      `<h3>9. Decision</h3><p><b>Preliminary status: Conditional GO for validated pilot/feasibility phase.</b> Do not proceed to full scale until demand, approvals, capacity, cost and governance assumptions are confirmed.</p>`;
    }else if(type==='proposal'){
      html=docHeader('AliTechGrid Partnership / Solution Proposal — Working Draft',r)+
      `<h3>1. Proposed objective</h3><p>Collaboratively address ${safe(r.goal.replaceAll('-',' '))} while strengthening ${r.gaps.map(safe).join(', ')}.</p>`+
      `<h3>2. Proposed scope</h3>${bullets([r.collabRec,'Readiness validation and solution design','Role-specific capability development','Controlled proof of value','Evidence, governance and scale decision'])}`+
      `<h3>3. Proposed responsibilities — Institution / Client</h3>${bullets(['Provide authorized stakeholders and non-sensitive context','Own academic/business approvals and policy decisions','Provide access to approved systems/data under agreed controls','Assign accountable sponsor and operational owner'])}`+
      `<h3>4. Proposed responsibilities — AliTechGrid</h3>${bullets(['Facilitate diagnostic and solution architecture','Support curriculum/workflow design and capability development','Develop pilot artifacts, evaluation and evidence package','Support implementation roadmap and expert review'])}`+
      `<h3>5. Governance</h3><p>Use joint steering, defined decision rights, change control, privacy/security review and evidence checkpoints. No party should imply a formal partnership before written agreement.</p>`+
      `<h3>6. Phasing</h3>${bullets(['Phase 1 — Discovery & feasibility','Phase 2 — Design & capability preparation','Phase 3 — Controlled pilot','Phase 4 — Evaluation & scale decision'])}`+
      `<h3>7. Success measures</h3>${bullets(kpis(r.org))}`+
      `<h3>8. Commercial & legal</h3><p>Pricing, IP, confidentiality, liability, credential ownership, branding and payment terms are intentionally excluded from this public draft and require negotiated written agreement.</p>`;
    }else if(type==='mou'){
      html=docHeader('Draft Memorandum of Understanding — NON-BINDING WORKING DRAFT',r)+
      `<h3>1. Purpose</h3><p>This draft records an intention to explore collaboration relating to ${safe(r.goal.replaceAll('-',' '))}. It does not create a binding partnership or legal obligation.</p>`+
      `<h3>2. Proposed areas of collaboration</h3>${bullets([r.collabRec,'Faculty/staff/leadership capability where applicable','Pilot and evaluation','Research, curriculum or technology collaboration where mutually approved'])}`+
      `<h3>3. Roles</h3><p>Each party retains responsibility for its own governance, personnel, approvals, regulated obligations and authorized representations.</p>`+
      `<h3>4. Academic credentials</h3><p>Any diploma, certificate or academic credential must be approved and awarded by the appropriately authorized institution. AliTechGrid support does not itself create accreditation or awarding authority.</p>`+
      `<h3>5. AI, data & privacy</h3><p>Protected data will not be shared until written data-handling, security, residency, access and retention requirements are agreed. Human accountability remains with designated decision-makers.</p>`+
      `<h3>6. Intellectual property & branding</h3><p>Background IP remains with its owner. New IP, content licensing and use of names/logos require a separate written agreement.</p>`+
      `<h3>7. Financial principles</h3><p>No financial commitment arises from this draft. Fees, costs, revenue sharing, procurement and funding require separate approval.</p>`+
      `<h3>8. Confidentiality</h3><p>Confidential information should be handled only under appropriate confidentiality terms.</p>`+
      `<h3>9. Term, review & termination</h3><p>Any final MoU should define effective date, review cycle, duration and termination notice.</p>`+
      `<h3>10. Legal review</h3><p><b>This is not legal advice and is not intended for signature as-is.</b> Each party should obtain appropriate legal and institutional review before execution.</p>`;
    }else if(type==='implementation'){
      html=docHeader('90-Day AI Implementation Plan',r)+
      `<h3>Workstream 1 — Governance & ownership</h3>${bullets(['Confirm sponsor, product/process owner and decision rights','Approve data/use boundaries and risk classification','Create pilot register, issue log and evidence plan'])}`+
      `<h3>Workstream 2 — Solution & architecture</h3><p>${safe(r.privacyRec)}</p>${bullets(['Confirm target workflow and integration points','Configure only required model/tool access','Define logging, testing, rollback and support'])}`+
      `<h3>Workstream 3 — People & change</h3>${bullets(['Baseline capability','Role-based training','Train champions / trainers','Weekly feedback and adoption review'])}`+
      `<h3>Workstream 4 — Evidence</h3>${bullets(kpis(r.org))}`+
      `<h3>Milestones</h3><p><b>Day 30:</b> scope, controls, baseline and pilot design approved. <b>Day 60:</b> pilot operating with trained users and evidence collection. <b>Day 90:</b> evaluation and scale/revise/stop decision.</p>`;
    }else{
      html=docHeader('Leadership Decision Brief — '+r.orgLabel+' AI Initiative',r)+
      `<h3>Decision required</h3><p>Approve, revise or defer a controlled strategic AI pilot addressing ${r.gaps.map(safe).join(', ')}.</p>`+
      `<h3>Why now</h3>${bullets(['AI use is already changing work and learning','Unmanaged adoption increases risk and inconsistency','A controlled pilot creates evidence before larger investment'])}`+
      `<h3>Recommendation</h3><p>Approve a 90-day controlled pathway with accountable ownership, defined data boundaries, capability development and measurable outcomes.</p>`+
      `<h3>What leadership should not approve yet</h3>${bullets(['Institution-wide scale without pilot evidence','Unvalidated ROI claims','Sensitive-data use without approved architecture and controls','Formal credential or partnership claims without institutional approval'])}`+
      `<h3>Success test</h3><p>At Day 90, compare quality, workload/time, adoption, risk incidents, user confidence and any learning/service outcomes against the baseline.</p>`;
    }
    html+=docFooter(r);
    const output=document.getElementById('document-output');
    document.getElementById('document-content').innerHTML=html;
    output.style.display='block';
    output.scrollIntoView({behavior:'smooth',block:'start'});
  }

  document.getElementById('next-btn').addEventListener('click',()=>{
    if(!valid()){
      alert('Please complete the required item before continuing.');
      return;
    }
    readStep();
    if(current<steps.length-1){
      current++;
      update();
      window.scrollTo({top:document.querySelector('.engine-shell').offsetTop-90,behavior:'smooth'});
    }else generate();
  });
  document.getElementById('back-btn').addEventListener('click',()=>{
    readStep();
    if(current>0)current--;
    update();
  });
  document.getElementById('generate-doc').addEventListener('click',generateDocument);
  document.getElementById('print-document').addEventListener('click',()=>{document.body.classList.add('print-decision-doc');window.print();});
  window.addEventListener('afterprint',()=>document.body.classList.remove('print-decision-doc'));
  document.getElementById('print-result').addEventListener('click',()=>window.print());
  document.getElementById('restart-engine').addEventListener('click',()=>{
    form.reset();
    Object.keys(state).forEach(k=>delete state[k]);
    lastResult=null;
    document.getElementById('engine-result').classList.remove('show');
    document.getElementById('engine-form-wrap').style.display='block';
    document.getElementById('document-output').style.display='none';
    current=0;
    update();
  });
  update();
})();
