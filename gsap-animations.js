/* ============================================================
   MARKET CENTER PLACE — gsap-animations.js
   Animations premium avec GSAP + ScrollTrigger
   Requis : gsap.min.js + ScrollTrigger.min.js + SplitText.min.js
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════
   INIT GSAP + PLUGINS
══════════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* Config globale */
gsap.config({ nullTargetWarn: false });
gsap.defaults({ ease: 'power3.out', duration: 0.8 });

/* ══════════════════════════════════════════════════
   1. LOADER PREMIUM
══════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        opacity: 0, scale: 1.05, duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => loader.remove()
      });
      /* Lancer les animations de la page après le loader */
      setTimeout(initPageAnimations, 100);
    }
  });

  /* Animation SVG du logo */
  tl.from('#loader circle',    { strokeDashoffset: 300, duration: 1,   ease: 'power2.inOut' })
    .from('#loader polygon',   { scale: 0, opacity: 0, transformOrigin: 'center', duration: 0.5, ease: 'back.out(2)' }, '-=0.3')
    .to('#loader',             {}, '+=0.4'); /* Pause 400ms */
}

/* ══════════════════════════════════════════════════
   2. ANIMATIONS HERO (page d'accueil)
══════════════════════════════════════════════════ */
function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const tl = gsap.timeline({ delay: 0.1 });

  /* Label "La marketplace de référence" */
  tl.from('.hero-label', {
    opacity: 0, y: 20, duration: 0.6, ease: 'power3.out'
  })

  /* H1 ligne par ligne */
  .from('.hero h1 .line', {
    opacity: 0,
    y: 60,
    skewY: 4,
    stagger: 0.12,
    duration: 0.9,
    ease: 'power4.out'
  }, '-=0.3')

  /* Description */
  .from('.hero-desc', {
    opacity: 0, y: 24, duration: 0.7
  }, '-=0.4')

  /* Boutons CTA */
  .from('.hero-cta > *', {
    opacity: 0, y: 20, scale: 0.95,
    stagger: 0.12, duration: 0.6,
    ease: 'back.out(1.5)'
  }, '-=0.3')

  /* Stats */
  .from('.hero-stat', {
    opacity: 0, y: 16, stagger: 0.1, duration: 0.5
  }, '-=0.2')

  /* Orbes de fond — flottement continu */
  .to('.hero-bg-glow', {
    y: -20, scale: 1.08,
    duration: 4, yoyo: true, repeat: -1,
    ease: 'sine.inOut',
    stagger: { each: 1.5, from: 'random' }
  }, 0);

  /* Parallaxe hero au scroll */
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => {
      gsap.set('.hero-bg', { y: self.progress * 120 });
      gsap.set('.hero h1',   { y: self.progress * 60, opacity: 1 - self.progress * 0.8 });
    }
  });
}

/* ══════════════════════════════════════════════════
   3. REVEAL AU SCROLL — VERSION GSAP
══════════════════════════════════════════════════ */
function initScrollReveals() {

  /* Reveal standard */
  gsap.utils.toArray('.reveal, .reveal-up').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y: 40,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* Reveal depuis la gauche */
  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.from(el, {
      opacity: 0, x: -50,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* Reveal depuis la droite */
  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.from(el, {
      opacity: 0, x: 50,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* Reveal scale */
  gsap.utils.toArray('.reveal-scale').forEach(el => {
    gsap.from(el, {
      opacity: 0, scale: 0.88,
      duration: 0.7, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* Stagger children — cartes, grilles */
  gsap.utils.toArray('.stagger-children').forEach(parent => {
    const children = parent.children;
    gsap.from(children, {
      opacity: 0, y: 36, scale: 0.96,
      stagger: 0.08, duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: { trigger: parent, start: 'top 85%' }
    });
  });
}

/* ══════════════════════════════════════════════════
   4. COUNT-UP — CHIFFRES CLÉS
══════════════════════════════════════════════════ */
function initCountUp() {
  gsap.utils.toArray('[data-target]').forEach(el => {
    const target   = parseFloat(el.dataset.target) || 0;
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const decimals = Number.isInteger(target) ? 0 : 1;
    const obj      = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target, duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = prefix
              + (decimals ? obj.val.toFixed(1) : Math.floor(obj.val).toLocaleString('fr-FR'))
              + suffix;
          }
        });
      }
    });
  });
}

/* ══════════════════════════════════════════════════
   5. CARTES PRODUITS — EFFET MAGNÉTIQUE 3D
══════════════════════════════════════════════════ */
function initCardMagnet() {
  const isMobile = window.innerWidth < 768;
  if (isMobile) return;

  document.querySelectorAll('.prod-card, .mode-card').forEach(card => {

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const rx   = ((e.clientY - cy) / rect.height) * -10;
      const ry   = ((e.clientX - cx) / rect.width)  *  10;

      gsap.to(card, {
        rotateX: rx, rotateY: ry,
        transformPerspective: 800,
        translateZ: 12,
        duration: 0.3, ease: 'power2.out',
        overwrite: 'auto'
      });

      /* Reflet lumineux qui suit la souris */
      const gloss = card.querySelector('.card-gloss');
      if (gloss) {
        const px = ((e.clientX - rect.left) / rect.width)  * 100;
        const py = ((e.clientY - rect.top)  / rect.height) * 100;
        gsap.set(gloss, { background: `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,.12) 0%, transparent 60%)` });
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        translateZ: 0,
        duration: 0.6, ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto'
      });
    });
  });
}

/* ══════════════════════════════════════════════════
   6. CURSEUR MAGNÉTIQUE PREMIUM
══════════════════════════════════════════════════ */
function initCursorPro() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.innerWidth < 768) return;
  if ('ontouchstart' in window) { dot.style.display='none'; ring.style.display='none'; return; }

  let mx = 0, my = 0;

  /* Suivi souris — dot immédiat */
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot,  { x: mx, y: my, duration: 0.05, overwrite: 'auto' });
    gsap.to(ring, { x: mx, y: my, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
  }, { passive: true });

  /* Agrandissement au survol cliquable */
  document.querySelectorAll('a, button, [onclick], .prod-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(dot,  { width: 14, height: 14, backgroundColor: '#0b1f4b', duration: 0.25 });
      gsap.to(ring, { width: 48, height: 48, borderColor: 'rgba(11,31,75,.45)', duration: 0.25 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(dot,  { width: 8,  height: 8,  backgroundColor: '#c0202a', duration: 0.25 });
      gsap.to(ring, { width: 32, height: 32, borderColor: 'rgba(192,32,42,.5)', duration: 0.25 });
    });
  });

  /* Compression au clic */
  window.addEventListener('mousedown', () => {
    gsap.to(dot,  { scale: 0.6, duration: 0.15 });
    gsap.to(ring, { scale: 0.8, duration: 0.15 });
  });
  window.addEventListener('mouseup', () => {
    gsap.to(dot,  { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    gsap.to(ring, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
  });
}

/* ══════════════════════════════════════════════════
   7. NAVBAR — MASQUAGE SCROLL + OMBRE
══════════════════════════════════════════════════ */
function initNavbar() {
  const nav = document.querySelector('nav#main-nav');
  if (!nav) return;

  let lastY = 0;

  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onUpdate: (self) => {
      const y = self.scroll();
      if (y > lastY && y > 200) {
        gsap.to(nav, { y: '-100%', duration: 0.35, ease: 'power2.inOut' });
      } else {
        gsap.to(nav, { y: 0, duration: 0.35, ease: 'power2.out' });
      }
      gsap.to(nav, { boxShadow: y > 40 ? '0 4px 40px rgba(0,0,0,.45)' : '0 4px 30px rgba(0,0,0,.3)', duration: 0.2 });
      lastY = y;
    }
  });
}

/* ══════════════════════════════════════════════════
   8. TRANSITIONS DE PAGE GSAP
══════════════════════════════════════════════════ */
function initPageTransitions() {
  /* Overlay */
  const overlay = document.createElement('div');
  overlay.id    = 'gsap-page-overlay';
  overlay.style.cssText = `
    position:fixed;inset:0;background:#0b1f4b;z-index:99999;
    transform-origin:right;transform:scaleX(0);pointer-events:none;
  `;
  document.body.appendChild(overlay);

  /* Entrée de page */
  gsap.fromTo(overlay,
    { scaleX: 1, transformOrigin: 'right' },
    { scaleX: 0, duration: 0.7, ease: 'power3.inOut', delay: 0.05 }
  );

  /* Sortie de page */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') || a.target === '_blank') return;
    e.preventDefault();

    overlay.style.transformOrigin = 'left';
    gsap.fromTo(overlay,
      { scaleX: 0 },
      {
        scaleX: 1, duration: 0.55, ease: 'power3.inOut',
        onComplete: () => { window.location.href = href; }
      }
    );
  });
}

/* ══════════════════════════════════════════════════
   9. SECTIONS AVEC EFFECT PIN (accueil)
══════════════════════════════════════════════════ */
function initPinnedSections() {
  /* Section chiffres — compteurs avec animation entrée spectaculaire */
  const numbers = document.querySelectorAll('.number-item');
  if (numbers.length) {
    gsap.from(numbers, {
      opacity: 0,
      y: 50,
      scale: 0.8,
      rotateX: 45,
      stagger: 0.12,
      duration: 0.8,
      ease: 'back.out(1.6)',
      scrollTrigger: {
        trigger: '#chiffres',
        start: 'top 80%'
      }
    });
  }

  /* Titres de section avec split text letter-by-letter */
  document.querySelectorAll('.section-title').forEach(title => {
    /* Split en spans */
    const words = title.innerHTML.split(/\s+/);
    title.innerHTML = words.map(w => `<span class="word" style="display:inline-block;overflow:hidden"><span style="display:inline-block">${w}</span></span>`).join(' ');

    gsap.from(title.querySelectorAll('.word > span'), {
      y: '110%',
      opacity: 0,
      stagger: 0.06,
      duration: 0.7,
      ease: 'power4.out',
      scrollTrigger: { trigger: title, start: 'top 85%' }
    });
  });
}

/* ══════════════════════════════════════════════════
   10. RIPPLE GSAP SUR LES BOUTONS
══════════════════════════════════════════════════ */
function initRippleGSAP() {
  document.querySelectorAll('.btn-hero-primary,.btn-hero-outline,.btn-submit,.btn-auth,.btn-cart,.btn-add').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x    = e.clientX - rect.left - size / 2;
      const y    = e.clientY - rect.top  - size / 2;

      const ripple    = document.createElement('div');
      ripple.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;width:${size}px;height:${size}px;left:${x}px;top:${y}px;background:rgba(255,255,255,.2);`;
      btn.appendChild(ripple);

      gsap.fromTo(ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.7, ease: 'power2.out',
          onComplete: () => ripple.remove() }
      );
    });
  });
}

/* ══════════════════════════════════════════════════
   11. CONNEXION — ANIMATIONS SPÉCIALES
══════════════════════════════════════════════════ */
function initConnexionAnimations() {
  const screenMode = document.getElementById('screen-mode');
  if (!screenMode) return;

  /* Orbes flottantes */
  gsap.utils.toArray('.orb').forEach((orb, i) => {
    gsap.to(orb, {
      x: `+=${30 + i * 15}`, y: `+=${20 + i * 10}`,
      duration: 5 + i * 2,
      yoyo: true, repeat: -1,
      ease: 'sine.inOut',
      delay: i * 0.8
    });
  });

  /* Cards mode — hover magnétique */
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -8, scale: 1.02, duration: 0.35, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
    card.addEventListener('click', () => {
      gsap.to(card, {
        scale: 0.96, duration: 0.1, yoyo: true, repeat: 1,
        ease: 'power2.inOut'
      });
    });
  });

  /* Transitions entre sections auth */
  const origGoStep = window.goStep;
  if (origGoStep) {
    window.goStep = function(id) {
      const sections = document.querySelectorAll('.f-section');
      const target   = document.getElementById('fs-' + id);
      if (!target) return origGoStep(id);

      const current = document.querySelector('.f-section.active');
      if (current && current !== target) {
        gsap.to(current, {
          opacity: 0, x: -20, duration: 0.2, ease: 'power2.in',
          onComplete: () => { origGoStep(id); gsap.fromTo(target, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }); }
        });
      } else {
        origGoStep(id);
        gsap.fromTo(target, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
      }
    };
  }

  /* Transitions entre modes avec morphing couleur panneau gauche */
  const origSelectMode = window.selectMode;
  if (origSelectMode) {
    window.selectMode = function(m) {
      origSelectMode(m);
      /* Slide du panneau de droite */
      gsap.from('.auth-panel-r', { x: 40, opacity: 0, duration: 0.5, ease: 'power3.out' });
      /* Flash de lumière sur le panneau gauche */
      gsap.fromTo('.auth-panel-l', { opacity: 0.6 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    };
  }

  /* OTP cells — animation d'entrée */
  const origStart2fa = window.start2fa;
  if (origStart2fa) {
    window.start2fa = function() {
      origStart2fa();
      gsap.from('.otp-c', {
        opacity: 0, y: 20, scale: 0.8,
        stagger: 0.06, duration: 0.4,
        ease: 'back.out(1.8)',
        delay: 0.1
      });
    };
  }
}

/* ══════════════════════════════════════════════════
   12. LIVE VENDEUR — ANIMATIONS TEMPS RÉEL
══════════════════════════════════════════════════ */
function initLiveAnimations() {
  const liveWin = document.getElementById('panel-live');
  if (!liveWin) return;

  /* Badge LIVE clignotant */
  gsap.to('.live-badge-dot', {
    opacity: 0.3, duration: 0.5,
    yoyo: true, repeat: -1, ease: 'power2.inOut'
  });

  /* Compteur spectateurs — pulse à chaque changement */
  const origSim = window.simulateLive;
  if (origSim) {
    window.simulateLive = function() {
      origSim();
      /* Animation sur les stats */
      setInterval(() => {
        gsap.from('#stat-viewers', {
          scale: 1.2, color: '#ff3b30', duration: 0.4, ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto'
        });
      }, 2000);
    };
  }

  /* Messages chat — animation d'entrée améliorée */
  const origAddMsg = window.addChatMsg;
  if (origAddMsg) {
    window.addChatMsg = function(name, text, color, isSystem) {
      origAddMsg(name, text, color, isSystem);
      const msgs = document.getElementById('chat-msgs');
      if (!msgs) return;
      const last = msgs.lastElementChild;
      if (last) {
        gsap.from(last, {
          opacity: 0, x: isSystem ? 0 : -16, y: 8,
          duration: 0.35, ease: 'power3.out'
        });
      }
    };
  }

  /* Bouton START LIVE — pulse rouge avant le lancement */
  gsap.to('#btn-go-live:not(.is-live)', {
    boxShadow: '0 0 0 0 rgba(255,59,48,0), 0 0 0 12px rgba(255,59,48,0)',
    repeat: -1, duration: 1.4, ease: 'power2.out',
    keyframes: [
      { boxShadow: '0 0 0 0 rgba(255,59,48,.4)' },
      { boxShadow: '0 0 0 14px rgba(255,59,48,0)' }
    ]
  });

  /* Produits épinglés — entrée avec bounce */
  const origPin = window.confirmPin;
  if (origPin) {
    window.confirmPin = function() {
      origPin();
      const cards = document.querySelectorAll('#pinned-products-list .pinned-product-card');
      const last  = cards[cards.length - 1];
      if (last) {
        gsap.from(last, {
          opacity: 0, x: 20, scale: 0.9,
          duration: 0.45, ease: 'back.out(1.6)'
        });
      }
    };
  }

  /* Tabs studio — transition coulissante */
  const origSwitch = window.switchTab;
  if (origSwitch) {
    window.switchTab = function(tab) {
      const oldPanel = document.querySelector('.studio-panel.active');
      origSwitch(tab);
      const newPanel = document.querySelector('.studio-panel.active');
      if (newPanel && newPanel !== oldPanel) {
        gsap.from(newPanel, { opacity: 0, y: 20, duration: 0.4, ease: 'power3.out' });
      }
    };
  }
}

/* ══════════════════════════════════════════════════
   13. TOAST GSAP
══════════════════════════════════════════════════ */
function initToastGSAP() {
  /* Surcharger showToast pour utiliser GSAP */
  const origToast = window.showToast;
  window.showToast = function(msg, type) {
    const t = document.getElementById('mcp-toast') || document.getElementById('a-toast') || document.getElementById('auth-toast');
    if (!t) { if(origToast) origToast(msg, type); return; }

    const icons = {
      success: '<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
      error:   '<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    };
    t.className = (t.className.replace(/mcp-toast|a-toast|auth-toast/g,'') || 'mcp-toast') + ' ' + (type||'');
    t.innerHTML = (icons[type]||'') + '<span>' + msg + '</span>';

    gsap.killTweensOf(t);
    gsap.fromTo(t,
      { y: 100, opacity: 0, scale: 0.85 },
      { y: 0,   opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
    gsap.to(t, {
      y: 100, opacity: 0, duration: 0.4, ease: 'power3.in', delay: 3.2,
      onComplete: () => gsap.set(t, { clearProps: 'all' })
    });
  };
}

/* ══════════════════════════════════════════════════
   14. BARRE DE PROGRESSION SCROLL
══════════════════════════════════════════════════ */
function initProgressBar() {
  const bar = document.getElementById('progress');
  if (!bar) return;
  gsap.to(bar, {
    scaleX: 1,
    transformOrigin: 'left',
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  });
  gsap.set(bar, { scaleX: 0, transformOrigin: 'left', opacity: 1 });
}

/* ══════════════════════════════════════════════════
   15. BADGE PANIER — POP ANIMÉ
══════════════════════════════════════════════════ */
const origUpdateCart = window.mcpUpdateCart;
window.mcpUpdateCart = function() {
  if (origUpdateCart) origUpdateCart();
  const badges = document.querySelectorAll('.cart-count,[data-cart-count]');
  badges.forEach(badge => {
    if (badge.style.display !== 'none') {
      gsap.from(badge, {
        scale: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)', overwrite: true
      });
    }
  });
};

/* ══════════════════════════════════════════════════
   INIT GLOBALE
══════════════════════════════════════════════════ */
function initPageAnimations() {
  initHero();
  initScrollReveals();
  initCountUp();
  initCardMagnet();
  initRippleGSAP();
  initPinnedSections();
}

document.addEventListener('DOMContentLoaded', () => {
  initCursorPro();
  initNavbar();
  initPageTransitions();
  initToastGSAP();
  initProgressBar();
  initConnexionAnimations();
  initLiveAnimations();

  /* Si pas de loader → lancer les animations directement */
  if (!document.getElementById('loader')) {
    initPageAnimations();
  } else {
    initLoader();
  }
});

/* Exposer pour usage externe */
window.gsapMCP = { initCardMagnet, initScrollReveals };
