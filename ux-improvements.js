/* ════════════════════════════════════════════════════════
   MARKET CENTER PLACE — ux-improvements.js
   Améliorations UX : feedback panier, états vides,
   validation formulaires, loading states
════════════════════════════════════════════════════════ */

'use strict';

/* ── LAZY LOADING OBSERVER ── */
(function() {
  if (!('IntersectionObserver' in window)) return;
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const obs  = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '50px' });
  imgs.forEach(function(img) { obs.observe(img); });
})();

/* ── FEEDBACK VISUEL AJOUT PANIER ── */
window.addToCartWithFeedback = function(btn, product) {
  if (!btn) return;
  var orig = btn.innerHTML;
  btn.classList.add('btn-added-to-cart');
  btn.disabled = true;
  btn.innerHTML = '<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white"><polyline points="20 6 9 17 4 12"/></svg> Ajouté !';

  // Bump badge panier
  var badge = document.querySelector('.cart-count, [data-cart-count]');
  if (badge) badge.classList.add('cart-badge-bump');
  setTimeout(function() {
    if (badge) badge.classList.remove('cart-badge-bump');
  }, 400);

  setTimeout(function() {
    btn.innerHTML = orig;
    btn.classList.remove('btn-added-to-cart');
    btn.disabled = false;
  }, 1800);
};

/* ── LOADING STATE SUR BOUTONS ── */
window.setBtnLoading = function(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn._origHTML = btn.innerHTML;
    btn._origDisabled = btn.disabled;
    btn.classList.add('btn-loading');
    btn.disabled = true;
    btn.innerHTML = '<span style="opacity:0">' + btn.textContent + '</span>';
  } else {
    btn.classList.remove('btn-loading');
    btn.disabled = btn._origDisabled || false;
    btn.innerHTML = btn._origHTML || btn.innerHTML;
  }
};

/* ── VALIDATION FORMULAIRES ── */
window.validateForm = function(form) {
  var valid = true;
  var inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

  inputs.forEach(function(input) {
    var err = input.parentNode.querySelector('.field-error-msg');
    if (!err) {
      err = document.createElement('div');
      err.className = 'field-error-msg';
      err.style.cssText = 'font-size:.65rem;font-weight:700;color:#c0202a;margin-top:3px;display:none';
      input.parentNode.appendChild(err);
    }

    input.style.borderColor = '';
    err.style.display = 'none';

    if (!input.value.trim()) {
      input.style.borderColor = '#c0202a';
      err.textContent = 'Ce champ est obligatoire';
      err.style.display = 'block';
      valid = false;
      return;
    }

    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.style.borderColor = '#c0202a';
      err.textContent = 'Adresse email invalide';
      err.style.display = 'block';
      valid = false;
      return;
    }

    if (input.type === 'tel' && input.value.replace(/[^0-9]/g,'').length < 8) {
      input.style.borderColor = '#c0202a';
      err.textContent = 'Numéro de téléphone invalide';
      err.style.display = 'block';
      valid = false;
      return;
    }

    if (input.type === 'password' && input.value.length < 8) {
      input.style.borderColor = '#c0202a';
      err.textContent = 'Minimum 8 caractères';
      err.style.display = 'block';
      valid = false;
      return;
    }
  });

  return valid;
};

/* ── SANITISATION INPUTS ── */
window.sanitizeInput = function(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/* ── TOAST GLOBAL AMÉLIORÉ ── */
(function() {
  var toast = null;
  var timer = null;

  window.showToast = function(msg, type, duration) {
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mcp-toast-global';
      toast.style.cssText = [
        'position:fixed;bottom:1.4rem;left:50%;z-index:99999',
        'transform:translateX(-50%) translateY(100px)',
        'background:#080e20;color:white;border-radius:8px',
        'padding:.75rem 1.3rem;font-family:Montserrat,sans-serif',
        'font-size:.76rem;font-weight:700',
        'box-shadow:0 8px 28px rgba(0,0,0,.25)',
        'transition:transform .32s cubic-bezier(.34,1.2,.64,1)',
        'display:flex;align-items:center;gap:8px',
        'max-width:calc(100vw - 2rem)',
        'white-space:nowrap',
      ].join(';');
      document.body.appendChild(toast);
    }

    clearTimeout(timer);

    var icons = {
      success: '<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white"><polyline points="20 6 9 17 4 12"/></svg>',
      error:   '<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      info:    '<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="white"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    };

    var bg = type === 'success' ? '#16a34a' : type === 'error' ? '#c0202a' : '#0b1f4b';
    toast.style.background  = bg;
    toast.innerHTML = (icons[type] || '') + msg;

    void toast.offsetWidth;
    toast.style.transform = 'translateX(-50%) translateY(0)';

    timer = setTimeout(function() {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, duration || 3000);
  };
})();

/* ── ÉTATS VIDES ── */
window.showEmptyState = function(container, title, desc, ctaText, ctaHref) {
  if (!container) return;
  container.innerHTML = [
    '<div class="empty-state">',
    '<svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="#cbd5e1">',
    '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>',
    '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    '</svg>',
    '<div class="empty-state-title">' + title + '</div>',
    '<div class="empty-state-desc">' + desc + '</div>',
    ctaText ? '<a href="' + (ctaHref||'#') + '" class="btn-empty-cta" style="display:inline-flex;align-items:center;gap:7px;background:#0b1f4b;color:white;padding:11px 22px;border-radius:7px;text-decoration:none;font-weight:800;font-size:.78rem">' + ctaText + '</a>' : '',
    '</div>',
  ].join('');
};

/* ── MOBILE MENU ── */
(function() {
  var ham = document.querySelector('.nav-hamburger, #nav-hamburger');
  var menu = document.querySelector('.nav-menu');
  if (!ham || !menu) return;

  ham.addEventListener('click', function() {
    var open = menu.classList.toggle('open');
    ham.setAttribute('aria-expanded', String(open));
    // Overlay
    var overlay = document.getElementById('nav-mobile-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'nav-mobile-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9998;display:none';
      overlay.addEventListener('click', function() {
        menu.classList.remove('open');
        overlay.style.display = 'none';
        ham.setAttribute('aria-expanded','false');
      });
      document.body.appendChild(overlay);
    }
    overlay.style.display = open ? 'block' : 'none';
  });
})();

/* ── FILTRE CATALOGUE MOBILE ── */
(function() {
  var filterBtn = document.querySelector('.mobile-filter-btn');
  var sidebar   = document.querySelector('.catalogue-sidebar, .filters-sidebar');
  if (!filterBtn || !sidebar) return;

  filterBtn.addEventListener('click', function() {
    sidebar.classList.toggle('mobile-open');
    filterBtn.setAttribute('aria-expanded', String(sidebar.classList.contains('mobile-open')));
  });
})();

/* ── SKIP TO CONTENT (accessibilité) ── */
(function() {
  var main = document.querySelector('main, #main-content, .page-content');
  if (!main) return;
  if (!main.id) main.id = 'main-content';

  var skip = document.createElement('a');
  skip.href = '#main-content';
  skip.textContent = 'Aller au contenu principal';
  skip.style.cssText = [
    'position:absolute;top:-40px;left:0;z-index:99999',
    'background:#c0202a;color:white;padding:8px 16px',
    'border-radius:0 0 6px 0;font-weight:700;font-size:.78rem',
    'text-decoration:none;transition:top .2s',
  ].join(';');
  skip.addEventListener('focus', function() { skip.style.top = '0'; });
  skip.addEventListener('blur',  function() { skip.style.top = '-40px'; });
  document.body.insertBefore(skip, document.body.firstChild);
})();

/* ════════════════════════════════════════════════════════
   SÉCURITÉ FRONT-END
════════════════════════════════════════════════════════ */

/* ── Sanitisation avancée ── */
window.sanitizeHTML = function(str) {
  if (typeof str !== 'string') return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/* ── Validation email ── */
window.isValidEmail = function(email) {
  return /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(email.trim());
};

/* ── Validation téléphone CI ── */
window.isValidPhone = function(phone) {
  var clean = phone.replace(/[\s\-\.]/g, '');
  // Formats acceptés: +225XXXXXXXXXX, 0XXXXXXXXX, XXXXXXXXXX
  return /^(\+225|00225|225)?[0-9]{8,10}$/.test(clean);
};

/* ── Validation mot de passe ── */
window.validatePassword = function(pwd) {
  var result = { valid: false, score: 0, message: '' };
  if (!pwd || pwd.length < 8) {
    result.message = 'Minimum 8 caractères requis';
    return result;
  }
  var score = 0;
  if (pwd.length >= 8)  score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  var labels = ['Très faible', 'Faible', 'Bon', 'Excellent'];
  result.score   = score;
  result.valid   = score >= 2;
  result.message = labels[Math.min(score - 1, 3)] || 'Trop faible';
  return result;
};

/* ── Protéger les tokens en mémoire ── */
(function() {
  var _token = null;
  window.MCP_AUTH = {
    setToken: function(t) { _token = t; },
    getToken: function()  { return _token; },
    clear:    function()  { _token = null; },
    isAuthenticated: function() { return !!_token; },
  };
  // Nettoyer à la fermeture
  window.addEventListener('beforeunload', function() {
    _token = null;
  });
})();

/* ── Protection CSRF simple ── */
window.getCsrfToken = function() {
  var token = sessionStorage.getItem('mcp_csrf');
  if (!token) {
    token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(function(b) { return b.toString(16).padStart(2,'0'); })
      .join('');
    sessionStorage.setItem('mcp_csrf', token);
  }
  return token;
};

/* ── Détection tentatives suspectes ── */
(function() {
  var failedAttempts = 0;
  var MAX_ATTEMPTS   = 5;
  var lockUntil      = 0;

  window.recordLoginAttempt = function(success) {
    if (success) {
      failedAttempts = 0;
      lockUntil = 0;
      return true;
    }
    failedAttempts++;
    if (failedAttempts >= MAX_ATTEMPTS) {
      lockUntil = Date.now() + 15 * 60 * 1000; // 15 min
      window.showToast('Trop de tentatives. Attendez 15 minutes.', 'error');
      return false;
    }
    window.showToast('Identifiants incorrects. ' + (MAX_ATTEMPTS - failedAttempts) + ' tentatives restantes.', 'error');
    return false;
  };

  window.isLoginLocked = function() {
    if (lockUntil && Date.now() < lockUntil) {
      var rem = Math.ceil((lockUntil - Date.now()) / 60000);
      window.showToast('Compte temporairement bloqué. Réessayez dans ' + rem + ' min.', 'error');
      return true;
    }
    return false;
  };
})();

/* ── Headers sécurité sur les fetch ── */
var _origFetch = window.fetch;
window.fetch = function(url, options) {
  options = options || {};
  options.headers = options.headers || {};
  // Ajouter token CSRF sur les mutations
  if (options.method && options.method !== 'GET') {
    options.headers['X-CSRF-Token'] = window.getCsrfToken();
  }
  // Ajouter token auth si disponible
  var token = window.MCP_AUTH && window.MCP_AUTH.getToken();
  if (token && !options.headers['Authorization']) {
    options.headers['Authorization'] = 'Bearer ' + token;
  }
  return _origFetch.call(this, url, options);
};

/* ── Nettoyer les données avant soumission ── */
window.cleanFormData = function(formData) {
  var cleaned = {};
  for (var key in formData) {
    if (typeof formData[key] === 'string') {
      cleaned[key] = formData[key].trim().substring(0, 1000);
    } else {
      cleaned[key] = formData[key];
    }
  }
  return cleaned;
};
