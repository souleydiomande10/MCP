/* ============================================================
   MARKET CENTER PLACE — script.js v2.0 Premium
   Animations et interactions de haute qualite
   ============================================================ */

'use strict';

/* ═══ 1. KEYFRAMES GLOBAUX ═══════════════════════════════════ */
(function() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes loaderSpin    { to{transform:rotate(360deg)} }
    @keyframes loaderFadeOut { to{opacity:0;visibility:hidden} }
    @keyframes rippleAnim    { to{transform:scale(3.5);opacity:0} }
    @keyframes shakeX        { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
    @keyframes floatY        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes gradShift     { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes badgePop      { from{transform:scale(0)} 80%{transform:scale(1.2)} to{transform:scale(1)} }
    @keyframes shimmer       { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes logoRingSpin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
    @keyframes logoDotPulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
    @keyframes logoMDraw     { to{stroke-dashoffset:0} }

    .reveal       { opacity:0; transform:translateY(28px);  transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1); }
    .reveal-left  { opacity:0; transform:translateX(-32px); transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1); }
    .reveal-right { opacity:0; transform:translateX(32px);  transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1); }
    .reveal-scale { opacity:0; transform:scale(.92);        transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1); }
    .reveal.visible,.reveal-left.visible,.reveal-right.visible,.reveal-scale.visible { opacity:1; transform:none; }

    .stagger-children > *:nth-child(1){transition-delay:.05s}
    .stagger-children > *:nth-child(2){transition-delay:.12s}
    .stagger-children > *:nth-child(3){transition-delay:.19s}
    .stagger-children > *:nth-child(4){transition-delay:.26s}
    .stagger-children > *:nth-child(5){transition-delay:.33s}
    .stagger-children > *:nth-child(6){transition-delay:.40s}
    .stagger-children > *:nth-child(7){transition-delay:.47s}
    .stagger-children > *:nth-child(8){transition-delay:.54s}

    #cursor     { width:8px;height:8px;background:#c0202a;border-radius:50%;position:fixed;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:width .2s,height .2s,background .2s; }
    #cursorRing { width:32px;height:32px;border:1.5px solid rgba(192,32,42,.5);border-radius:50%;position:fixed;pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:width .2s,height .2s,border-color .2s; }

    #progress { position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#c0202a,#c8a84b);width:0;z-index:99997;border-radius:0 99px 99px 0;transition:opacity .3s; }

    .page-transition-overlay { position:fixed;inset:0;background:#0b1f4b;z-index:99996;transform:scaleY(0);transform-origin:top;transition:transform .45s cubic-bezier(.76,0,.24,1); }
    .page-transition-overlay.enter { transform:scaleY(1); }
    .page-transition-overlay.leave { transform-origin:bottom;transform:scaleY(0); }

    #mcp-toast { position:fixed;bottom:1.5rem;right:1.5rem;background:#0b1f4b;color:#fff;border-radius:8px;padding:.85rem 1.2rem;font-family:'Montserrat',sans-serif;font-size:.78rem;font-weight:700;box-shadow:0 8px 32px rgba(0,0,0,.25);z-index:9999;display:flex;align-items:center;gap:.6rem;transform:translateY(100px) scale(.95);opacity:0;transition:transform .35s cubic-bezier(.34,1.2,.64,1),opacity .25s;max-width:320px; }
    #mcp-toast.show    { transform:translateY(0) scale(1);opacity:1; }
    #mcp-toast.success { background:#16a34a; }
    #mcp-toast.error   { background:#c0202a; }
    #mcp-toast.warning { background:#f59e0b; }
    #mcp-toast svg     { stroke:white;flex-shrink:0; }

    .hover-lift { transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease; }
    .hover-lift:hover { transform:translateY(-5px);box-shadow:0 16px 48px rgba(0,0,0,.15); }

    .btn-loading { position:relative;pointer-events:none; }
    .btn-loading::after { content:'';position:absolute;top:50%;left:50%;width:16px;height:16px;margin:-8px 0 0 -8px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:loaderSpin .7s linear infinite; }
    .btn-loading > * { opacity:0; }

    .shake { animation:shakeX .4s ease; }
    .float-anim { animation:floatY 4s ease-in-out infinite; }
    .skeleton { background:linear-gradient(90deg,#e8edf5 25%,#f4f6fb 50%,#e8edf5 75%);background-size:200% 100%;animation:shimmer 1.4s ease-in-out infinite;border-radius:4px; }

    [data-tooltip] { position:relative; }
    [data-tooltip]::after { content:attr(data-tooltip);position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%) translateY(4px);background:#080e20;color:#fff;border-radius:5px;padding:5px 10px;font-size:.67rem;font-weight:700;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .2s,transform .2s;z-index:100; }
    [data-tooltip]:hover::after { opacity:1;transform:translateX(-50%) translateY(0); }
  `;
  document.head.appendChild(s);
})();


/* ═══ 2. LOADER ══════════════════════════════════════════════ */
(function() {
  function dismiss() {
    const l = document.getElementById('loader');
    if (!l) return;
    l.style.transition = 'opacity .6s ease, visibility .6s ease';
    l.style.opacity    = '0';
    l.style.visibility = 'hidden';
    setTimeout(() => l?.remove(), 700);
  }
  window.addEventListener('load', () => setTimeout(dismiss, 900));
  setTimeout(dismiss, 2800);
})();


/* ═══ 3. CURSEUR PERSONNALISE (lag élégant) ══════════════════ */
(function() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;
  if ('ontouchstart' in window) { cursor.style.display='none'; ring.style.display='none'; return; }

  let mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; }, { passive:true });

  (function tick() {
    cursor.style.left = mx+'px'; cursor.style.top = my+'px';
    rx += (mx-rx)*0.11; ry += (my-ry)*0.11;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(tick);
  })();

  document.addEventListener('mousedown', () => { cursor.style.transform='translate(-50%,-50%) scale(.65)'; });
  document.addEventListener('mouseup',   () => { cursor.style.transform='translate(-50%,-50%) scale(1)'; });
  document.addEventListener('mouseleave',() => { cursor.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter',() => { cursor.style.opacity='1'; ring.style.opacity='1'; });

  // Agrandir au survol des éléments cliquables
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest('a,button,[onclick]')) {
      cursor.style.width='14px'; cursor.style.height='14px'; cursor.style.background='#0b1f4b';
      ring.style.width='44px'; ring.style.height='44px'; ring.style.borderColor='rgba(11,31,75,.4)';
    } else {
      cursor.style.width='8px'; cursor.style.height='8px'; cursor.style.background='#c0202a';
      ring.style.width='32px'; ring.style.height='32px'; ring.style.borderColor='rgba(192,32,42,.5)';
    }
  }, { passive:true });
})();


/* ═══ 4. BARRE PROGRESSION SCROLL ═══════════════════════════ */
(function() {
  const bar = document.getElementById('progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? Math.min((window.scrollY/total)*100, 100) : 0;
    bar.style.width   = pct + '%';
    bar.style.opacity = window.scrollY > 20 ? '1' : '0';
  }, { passive:true });
})();


/* ═══ 5. REVEAL AU SCROLL ════════════════════════════════════ */
(function() {
  function observe(scope) {
    const els = (scope || document).querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold:0.08, rootMargin:'0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
  }
  observe();
  window.mcpInitReveal = observe;
})();


/* ═══ 6. COUNT-UP ANIMÉ ══════════════════════════════════════ */
(function() {
  function easeOut(t) { return 1-Math.pow(1-t,4); }
  function run(el) {
    const target   = parseInt(el.dataset.target) || 0;
    const duration = parseInt(el.dataset.duration) || 1800;
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    let   start    = null;
    (function step(ts) {
      if(!start) start=ts;
      const p = Math.min((ts-start)/duration, 1);
      el.textContent = prefix + Math.floor(easeOut(p)*target).toLocaleString('fr-FR') + suffix;
      if(p<1) requestAnimationFrame(step);
    })(performance.now());
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted='1'; run(e.target); obs.unobserve(e.target);
      }
    });
  }, { threshold:.4 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
})();


/* ═══ 7. RIPPLE SUR LES BOUTONS ════════════════════════════════ */
function mcpRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width,rect.height)*1.8;
  const r = document.createElement('span');
  r.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;transform:scale(0);background:rgba(255,255,255,.18);animation:rippleAnim .55s cubic-bezier(.22,1,.36,1) forwards;`;
  btn.style.position='relative'; btn.style.overflow='hidden';
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
}
(function() {
  document.querySelectorAll('.btn-hero-primary,.btn-hero-secondary,.btn-cart,.btn-add,.btn-submit,.btn-editor,.nl-form button,.btn-new-product,.btn-start-live').forEach(b => b.addEventListener('click',mcpRipple));
  window.mcpAddRipple = el => el.addEventListener('click',mcpRipple);
})();


/* ═══ 8. NAVBAR — MASQUAGE AU SCROLL VERS LE BAS ═════════════ */
(function() {
  const nav = document.querySelector('nav#main-nav');
  if (!nav) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.style.boxShadow = y>40 ? '0 4px 40px rgba(0,0,0,.45)' : '0 4px 30px rgba(0,0,0,.3)';
    nav.style.transition = 'transform .35s ease, box-shadow .2s';
    if (y > 200) nav.style.transform = y>lastY ? 'translateY(-100%)' : 'translateY(0)';
    else         nav.style.transform = 'translateY(0)';
    lastY = y;
  }, { passive:true });
})();


/* ═══ 9. TOAST GLOBAL ════════════════════════════════════════ */
(function() {
  if (!document.getElementById('mcp-toast')) {
    const t = document.createElement('div'); t.id='mcp-toast'; document.body.appendChild(t);
  }
  let timer;
  const ICONS = {
    success:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
    error:  '<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    warning:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>',
    info:   '<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>',
  };
  window.showToast = function(msg, type) {
    const t = document.getElementById('mcp-toast');
    if (!t) return;
    clearTimeout(timer);
    t.className = 'mcp-toast '+(type||'');
    t.innerHTML = (ICONS[type]||'')+' <span>'+msg+'</span>';
    void t.offsetWidth;
    t.classList.add('show');
    timer = setTimeout(()=>t.classList.remove('show'), 3500);
  };
})();


/* ═══ 10. TRANSITION DE PAGE FLUIDE ═════════════════════════ */
(function() {
  const ov = document.createElement('div');
  ov.className = 'page-transition-overlay';
  document.body.appendChild(ov);
  setTimeout(()=>ov.classList.add('leave'), 50);

  document.addEventListener('click', function(e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') || a.target==='_blank') return;
    e.preventDefault();
    ov.classList.remove('leave'); ov.classList.add('enter');
    setTimeout(()=>{ window.location.href=href; }, 430);
  });
})();


/* ═══ 11. PARALLAXE HERO (léger) ═══════════════════════════ */
(function() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const heroes = document.querySelectorAll('.hero-section,.cat-hero,.search-hero,.vendor-hero');
  if (!heroes.length) return;
  let ticking = false;
  window.addEventListener('scroll', ()=>{
    if(!ticking){
      requestAnimationFrame(()=>{
        heroes.forEach(hero=>{
          const bg = hero.querySelector('.parallax-bg');
          const offset = window.scrollY*0.25;
          if(bg) bg.style.transform=`translateY(${offset}px)`;
          else   hero.style.backgroundPositionY=`calc(50% + ${offset}px)`;
        });
        ticking=false;
      });
      ticking=true;
    }
  }, {passive:true});
})();


/* ═══ 12. MICRO-INTERACTIONS CARTES 3D ══════════════════════ */
function mcpInitCard(card) {
  card.addEventListener('mousemove', function(e) {
    if (window.innerWidth<768) return;
    const r=this.getBoundingClientRect();
    const rotX=((e.clientY-r.top-r.height/2)/r.height)*-7;
    const rotY=((e.clientX-r.left-r.width/2)/r.width)*7;
    this.style.transform=`perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    this.style.transition='transform .05s ease';
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform='perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    this.style.transition='transform .4s cubic-bezier(.22,1,.36,1)';
  });
}
document.querySelectorAll('.prod-card').forEach(mcpInitCard);
window.mcpInitCard = mcpInitCard;


/* ═══ 13. BADGE PANIER + TOAST ══════════════════════════════ */
window.mcpUpdateCart = function() {
  const items = JSON.parse(localStorage.getItem('mcp_cart')||'[]');
  const total = items.reduce((s,i)=>s+(i.qty||1),0);
  document.querySelectorAll('.cart-count,[data-cart-count]').forEach(el=>{
    el.textContent = total;
    el.style.display = total>0 ? 'flex' : 'none';
    el.style.animation='none'; void el.offsetWidth;
    el.style.animation='badgePop .35s cubic-bezier(.34,1.56,.64,1)';
  });
  if (total>0 && window._lastCart!==undefined && total>window._lastCart) {
    showToast('Produit ajouté au panier !','success');
  }
  window._lastCart=total;
};

window.addToCart = function(btn, id, name, price) {
  const items = JSON.parse(localStorage.getItem('mcp_cart')||'[]');
  const found = items.find(i=>i.id===id);
  if(found) found.qty=(found.qty||1)+1;
  else items.push({id,name,price,qty:1});
  localStorage.setItem('mcp_cart',JSON.stringify(items));
  if(btn){
    const orig=btn.innerHTML;
    btn.innerHTML='<svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg> Ajouté !';
    btn.style.background='#16a34a'; btn.disabled=true;
    setTimeout(()=>{ btn.innerHTML=orig; btn.style.background=''; btn.disabled=false; },1600);
  }
  mcpUpdateCart();
};


/* ═══ 14. FORMULAIRES PREMIUM ════════════════════════════════ */
window.mcpShakeField = function(input) {
  input.classList.remove('shake'); void input.offsetWidth;
  input.classList.add('shake');
  input.style.borderColor='#c0202a';
  input.addEventListener('input',()=>input.style.borderColor='',{once:true});
};

window.mcpSetBtnLoading = function(btn, on) {
  btn.classList.toggle('btn-loading', on);
  btn.disabled = on;
};

window.checkPwdStrength = function(input, prefix) {
  const v = input.value;
  const s = [v.length>=8, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
  const colors = ['#c0202a','#f59e0b','#3b82f6','#16a34a'];
  const labels = ['Très faible','Faible','Bon','Excellent'];
  const bar   = document.getElementById((prefix||'')+'b-pwd-bar');
  const label = document.getElementById((prefix||'')+'b-pwd-label');
  if(bar)  { bar.style.width=(s*25)+'%'; bar.style.background=colors[s-1]||'#e8edf5'; bar.style.transition='width .3s,background .3s'; }
  if(label && s>0) { label.textContent=labels[s-1]; label.style.color=colors[s-1]; }
};

window.validateEmail = function(input, hintId) {
  const hint = document.getElementById(hintId);
  if(!hint) return;
  if(!input.value) { hint.textContent=''; return; }
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
  hint.textContent = ok ? '✓ Email valide' : 'Format attendu : nom@domaine.ci';
  hint.style.color = ok ? '#16a34a' : '#c0202a';
  hint.style.fontSize='.68rem'; hint.style.fontWeight='700'; hint.style.marginTop='3px';
};

window.checkPwdMatch = function(id1, id2, hintId) {
  const hint = document.getElementById(hintId);
  if(!hint) return;
  const v2 = document.getElementById(id2)?.value;
  if(!v2) return;
  const ok = document.getElementById(id1)?.value === v2;
  hint.textContent = ok ? '✓ Mots de passe identiques' : '✗ Ne correspondent pas';
  hint.style.color = ok ? '#16a34a' : '#c0202a';
  hint.style.fontSize='.68rem'; hint.style.fontWeight='700';
};

window.togglePwd = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if(!input) return;
  const show = input.type==='password';
  input.type = show ? 'text' : 'password';
  if(btn) btn.innerHTML = show
    ? '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.8"><path d="M17.94 17.94A10 10 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    : '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
};


/* ═══ 15. RECHERCHE HEADER ══════════════════════════════════ */
(function() {
  const input = document.getElementById('header-search-input');
  if(!input) return;
  let db;
  input.addEventListener('input',function(){
    clearTimeout(db);
    db=setTimeout(()=>{
      const q=this.value.trim();
      if(q.length>=2) window.location.href='recherche.html?q='+encodeURIComponent(q);
    },600);
  });
  input.addEventListener('keydown',function(e){
    if(e.key==='Enter' && this.value.trim())
      window.location.href='recherche.html?q='+encodeURIComponent(this.value.trim());
  });
})();


/* ═══ 16. SMOOTH SCROLL ANCRES ══════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    const t=document.querySelector(this.getAttribute('href'));
    if(!t) return;
    e.preventDefault();
    window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-80,behavior:'smooth'});
  });
});


/* ═══ 17. IMAGES LAZY AVEC FADE ════════════════════════════ */
(function() {
  if(!('IntersectionObserver' in window)) return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const img=e.target;
      img.style.opacity='0'; img.style.transition='opacity .45s ease';
      if(img.dataset.src) img.src=img.dataset.src;
      img.addEventListener('load',()=>img.style.opacity='1',{once:true});
      if(!img.dataset.src) img.style.opacity='1';
      obs.unobserve(img);
    });
  },{rootMargin:'100px'});
  document.querySelectorAll('img[loading="lazy"]').forEach(img=>obs.observe(img));
})();


/* ═══ 18. SERVICE WORKER ════════════════════════════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/sw.js')
      .then(reg=>setInterval(()=>reg.update(), 30*60*1000))
      .catch(()=>{});
  });
}


/* ═══ 19. INIT DOMContentLoaded ═════════════════════════════ */
document.addEventListener('DOMContentLoaded',function(){
  if(typeof mcpUpdateCart==='function') mcpUpdateCart();
  document.querySelectorAll('.prod-card,.cat-card').forEach(el=>{
    if(!el.classList.contains('hover-lift')) el.classList.add('hover-lift');
  });
  document.querySelectorAll('.products-grid,.cats-grid,.results-grid').forEach(g=>{
    g.classList.add('stagger-children');
  });
});
