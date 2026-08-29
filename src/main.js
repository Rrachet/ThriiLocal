import './styles.css';

const capabilities = [
  ['01', 'Structured Job Tickets', 'Every role becomes a tracked, auditable ticket from JD intake through offer.'],
  ['02', 'Smart Matching', 'Rules-based scoring meets recruiter judgement to surface the right candidates faster.'],
  ['03', 'Multi-Role Workspace', 'Employer, recruiter, analyst, and candidate views in one connected platform.'],
  ['04', 'Realtime Analytics', 'Pipeline health, SLA breaches, and conversion ratios stay visible as work moves.'],
  ['05', 'Enterprise Security', 'RBAC, audit logs, and encrypted storage keep sensitive hiring workflows controlled.'],
  ['06', 'Workflow Automation', 'Disputes, resubmissions, escalations, and handoffs follow clear operational rules.']
];

const app = document.querySelector('#root');
app.innerHTML = `
  <div class="site-shell">
    <header class="nav-wrap">
      <nav class="nav container">
        <a class="brand" href="#top" aria-label="Thrii home"><span class="brand-mark">T</span><span>thrii<span class="dot">.</span>io</span></a>
        <div class="nav-links">
          <a href="#capabilities">Features</a><a href="#workflow">Workflow</a><a href="#plans">Plans</a>
        </div>
        <div class="nav-actions"><button class="btn ghost" data-modal="demo">Schedule a demo</button><button class="btn dark" data-modal="signup">Sign up</button></div>
        <button class="menu" aria-label="Open menu">☰</button>
      </nav>
    </header>

    <main id="top">
      <section class="hero container">
        <div class="hero-copy">
          <div class="eyebrow"><span class="pulse"></span>Hiring, restructured</div>
          <h1>The hiring stack<br/><em>built for precision.</em></h1>
          <p>Thrii.io unifies employers, recruiters, analysts, and candidates into a single, structured workflow — eliminating noise, friction, and missed signals.</p>
          <div class="hero-actions"><button class="btn dark large" data-modal="demo">Schedule a demo <span>↗</span></button><button class="text-btn" data-modal="signup">Sign up <span>→</span></button></div>
          <div class="fineprint"><span>✓ No credit card</span><span>✓ Cancel anytime</span></div>
        </div>
        <div class="hero-visual">
          <div class="glow"></div>
          <div class="dashboard-card">
            <div class="dash-top"><div><span class="label">Pipeline</span><strong>Last 30 days</strong></div><span class="growth">+18.2%</span></div>
            <div class="chart"><div class="chart-grid"></div><svg viewBox="0 0 500 170" preserveAspectRatio="none" aria-hidden="true"><path d="M0 145 C45 137 55 105 95 116 S150 131 183 86 S232 90 267 77 S318 98 345 57 S397 68 430 32 S474 44 500 12" fill="none" stroke="currentColor" stroke-width="3"/><path d="M0 145 C45 137 55 105 95 116 S150 131 183 86 S232 90 267 77 S318 98 345 57 S397 68 430 32 S474 44 500 12 L500 170 L0 170 Z" fill="currentColor" opacity=".08"/></svg></div>
            <div class="ticket"><div class="ticket-title"><span class="status-dot"></span><span>New Job Ticket</span><span class="ticket-id">#TH-2048</span></div><div class="ticket-grid"><div><span>Role title</span><b>Senior Backend Engineer</b></div><div><span>Plan</span><b>Gold</b></div><div><span>SLA</span><b>14 days</b></div><div><span>Publish</span><b>12 min ago</b></div></div></div>
          </div>
        </div>
      </section>

      <section class="metrics container"><div><strong>12,400<span>+</span></strong><small>Active job tickets</small></div><div><strong>98<span>%</span></strong><small>Match accuracy</small></div><div><strong>2.4<span>×</span></strong><small>Faster time-to-hire</small></div><div><strong>850<span>+</span></strong><small>Companies onboard</small></div></section>

      <section id="capabilities" class="section container"><div class="section-head"><div><div class="eyebrow">Capabilities</div><h2>A complete workflow<br/><em>not a stack of tools.</em></h2></div><p>One operating layer for every stakeholder in the hiring journey. Structured data in, actionable decisions out.</p></div><div class="cap-grid">${capabilities.map(([n,t,d])=>`<article class="cap"><span class="cap-num">${n}</span><div><h3>${t}</h3><p>${d}</p></div><span class="arrow">↗</span></article>`).join('')}</div></section>

      <section id="workflow" class="workflow"><div class="container"><div class="section-head light"><div><div class="eyebrow">Why Thrii.io</div><h2>From intake to offer,<br/><em>without the chaos.</em></h2></div><p>Hiring teams get a shared source of truth while candidates move through a clear, accountable process.</p></div><div class="flow"><div class="flow-line"></div>${[['01','INTAKE','Turn a JD into a structured job ticket.'],['02','MATCH','Score candidates against the role, not keywords alone.'],['03','REVIEW','Give each stakeholder the context they need.'],['04','OFFER','Track the final decision through close.']].map(([n,t,d])=>`<div class="flow-step"><span>${n}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div></div></section>

      <section id="plans" class="plans container"><div class="section-head"><div><div class="eyebrow">Plans</div><h2>Ready to operationalize<br/><em>hiring?</em></h2></div><p>Spin up your workspace in under two minutes. Start small, scale when your hiring operation grows.</p></div><div class="plan-grid"><article class="plan"><span class="plan-tag">START</span><h3>Core</h3><p>For teams building a repeatable hiring process.</p><div class="price">Custom</div><button class="btn dark full" data-modal="signup">Get started</button></article><article class="plan featured"><span class="plan-tag">MOST FLEXIBLE</span><h3>Gold</h3><p>For growing teams that need matching, analytics, and automation.</p><div class="price">Custom</div><button class="btn light-btn full" data-modal="demo">Talk to sales</button></article><article class="plan"><span class="plan-tag">ENTERPRISE</span><h3>Scale</h3><p>For complex hiring operations with security and governance needs.</p><div class="price">Custom</div><button class="btn dark full" data-modal="demo">Talk to sales</button></article></div></section>

      <section class="cta container"><div><div class="eyebrow">Ready when you are</div><h2>Make hiring feel<br/><em>operational.</em></h2></div><div class="cta-right"><p>Bring employers, recruiters, analysts, and candidates into one structured workflow.</p><div><button class="btn light-btn" data-modal="signup">Get started <span>↗</span></button><button class="btn outline" data-modal="demo">Talk to sales</button></div></div></section>
    </main>

    <footer><div class="container footer-grid"><div><a class="brand footer-brand" href="#top"><span class="brand-mark">T</span><span>thrii<span class="dot">.</span>io</span></a><p>Revolutionizing recruitment through technology and innovation.</p></div><div><h4>Product</h4><a href="#capabilities">Features</a><a href="#plans">Plans</a><a href="#workflow">Workflow</a></div><div><h4>Contact</h4><a href="mailto:rajat@thrii.io">rajat@thrii.io</a><a href="tel:+916300112759">+91 63001 12759</a><a href="https://www.linkedin.com/company/thrii3" target="_blank">LinkedIn</a></div></div><div class="container footer-bottom"><span>© 2026 Thrii.io. All rights reserved.</span><span>thrii.io</span></div></footer>

    <div class="modal-backdrop" aria-hidden="true"><div class="modal" role="dialog" aria-modal="true"><button class="close" aria-label="Close">×</button><div class="eyebrow">Thrii.io</div><h2 class="modal-title">Let's make hiring<br/><em>more precise.</em></h2><p class="modal-copy">Tell us where you are in your hiring journey and we'll take it from there.</p><form><label>Name<input required placeholder="Your name" /></label><label>Work email<input required type="email" placeholder="you@company.com" /></label><label>Company<input placeholder="Company name" /></label><button class="btn dark full" type="submit">Continue <span>→</span></button></form><p class="form-note">No credit card. No obligation.</p></div></div>
  </div>`;

const backdrop = document.querySelector('.modal-backdrop');
const modalTitle = document.querySelector('.modal-title');
document.querySelectorAll('[data-modal]').forEach(btn => btn.addEventListener('click', () => {
  modalTitle.innerHTML = btn.dataset.modal === 'demo' ? 'Book a <em>demo.</em>' : 'Create your <em>workspace.</em>';
  backdrop.classList.add('show'); backdrop.setAttribute('aria-hidden','false');
}));
document.querySelector('.close').addEventListener('click', closeModal);
backdrop.addEventListener('click', e => { if(e.target === backdrop) closeModal(); });
function closeModal(){ backdrop.classList.remove('show'); backdrop.setAttribute('aria-hidden','true'); }
document.querySelector('form').addEventListener('submit', e => { e.preventDefault(); document.querySelector('.modal-copy').textContent='Thanks — your request is in. The Thrii team will be in touch shortly.'; e.currentTarget.reset(); });

document.querySelector('.menu').addEventListener('click', () => document.querySelector('.nav-links').classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open')));
