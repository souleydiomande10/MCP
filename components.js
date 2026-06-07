/* ============================================================
   MARKET CENTER PLACE — components.js
   Header unique avec dropdowns JS + Footer partages
   ============================================================ */

/* ── LOGO SVG ANIME ── */
const MCP_LOGO_SVG = `<svg viewBox="0 0 38 38" fill="none" width="100%" height="100%" overflow="visible">
  <circle cx="19" cy="19" r="17" stroke="rgba(192,32,42,0.4)" stroke-width="1.5"
    stroke-dasharray="4 6" fill="none"
    style="transform-origin:19px 19px;animation:mcpSpin 9s linear infinite"/>
  <circle cx="19" cy="19" r="14" fill="#0b1f4b"/>
  <polyline points="10,26 10,13 19,22 28,13 28,26"
    stroke="#e8282f" stroke-width="2.8"
    stroke-linecap="round" stroke-linejoin="round" fill="none"
    style="stroke-dasharray:90;stroke-dashoffset:90;animation:mcpDraw 1s .2s ease forwards"/>
  <circle cx="30" cy="9" r="3.5" fill="#c8a84b"
    style="animation:mcpPulse 2.2s ease-in-out infinite"/>
</svg>`;

/* ── KEYFRAMES ── */
(function() {
  if (document.getElementById('mcp-kf')) return;
  const s = document.createElement('style');
  s.id = 'mcp-kf';
  s.textContent = `
    @keyframes mcpSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes mcpDraw  { to{stroke-dashoffset:0} }
    @keyframes mcpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }
    @keyframes ripple   { to{transform:scale(2.5);opacity:0} }
    @keyframes logoRingSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes logoDotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }
    @keyframes logoMDraw    { to{stroke-dashoffset:0} }
  `;
  document.head.appendChild(s);
})();

/* ── BASE PATH ── */
function getBase() {
  const path = window.location.pathname;
  if (path.includes('/vendeur/')) return '../';
  return '';
}

/* ── CONSTRUCTION HEADER ── */
function buildHeader() {
  const b = getBase();

  /* ── DONNÉES CATÉGORIES MEGA ── */
  const MEGA_CATS = [
    {
      id: 'electronique', label: 'Electronique', count: '1 820',
      icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
      sub: [
        { label: 'Smartphones & Tablettes', href: 'catalogue.html?cat=smartphones' },
        { label: 'Ordinateurs portables',   href: 'catalogue.html?cat=ordinateurs' },
        { label: 'TV & Ecrans',             href: 'catalogue.html?cat=tv' },
        { label: 'Ecouteurs & Audio',       href: 'catalogue.html?cat=audio' },
        { label: 'Accessoires telephone',   href: 'catalogue.html?cat=accessoires' },
        { label: 'Batteries & Chargeurs',   href: 'catalogue.html?cat=chargeurs' },
        { label: 'Cameras & Photos',        href: 'catalogue.html?cat=photo' },
        { label: 'Gaming & Consoles',       href: 'catalogue.html?cat=gaming' },
        { label: 'Imprimantes',             href: 'catalogue.html?cat=imprimantes' },
      ]
    },
    {
      id: 'mode', label: 'Mode & Wax', count: '2 430',
      icon: '<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>',
      sub: [
        { label: 'Robes & Tenues Wax',     href: 'catalogue.html?cat=robes-wax' },
        { label: 'Costumes homme',          href: 'catalogue.html?cat=costumes' },
        { label: 'Tissu Wax au metre',      href: 'catalogue.html?cat=tissu' },
        { label: 'Sacs & Maroquinerie',     href: 'catalogue.html?cat=sacs' },
        { label: 'Chaussures femme',        href: 'catalogue.html?cat=chaussures-f' },
        { label: 'Chaussures homme',        href: 'catalogue.html?cat=chaussures-h' },
        { label: 'Bijoux & Accessoires',    href: 'catalogue.html?cat=bijoux' },
        { label: 'Boubous & Grands Boubous',href: 'catalogue.html?cat=boubous' },
        { label: 'Tenues enfants',          href: 'catalogue.html?cat=enfants-mode' },
      ]
    },
    {
      id: 'maison', label: 'Maison & Deco', count: '980',
      icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
      sub: [
        { label: 'Meubles & Rangement',    href: 'catalogue.html?cat=meubles' },
        { label: 'Literie & Draps',        href: 'catalogue.html?cat=literie' },
        { label: 'Cuisine & Vaisselle',    href: 'catalogue.html?cat=cuisine' },
        { label: 'Decoration africaine',   href: 'catalogue.html?cat=deco-africaine' },
        { label: 'Eclairage',              href: 'catalogue.html?cat=eclairage' },
        { label: 'Electromenager',         href: 'catalogue.html?cat=electromenager' },
        { label: 'Jardin & Exterieur',     href: 'catalogue.html?cat=jardin' },
        { label: 'Tapis & Rideaux',        href: 'catalogue.html?cat=tapis' },
        { label: 'Art & Artisanat',        href: 'catalogue.html?cat=artisanat' },
      ]
    },
    {
      id: 'sante', label: 'Sante & Bien-etre', count: '760',
      icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
      sub: [
        { label: 'Vitamines & Complements', href: 'catalogue.html?cat=vitamines' },
        { label: 'Karite & Huiles naturels',href: 'catalogue.html?cat=karite' },
        { label: 'Cosmetiques naturels',    href: 'catalogue.html?cat=cosmetiques' },
        { label: 'Sport & Fitness',         href: 'catalogue.html?cat=sport' },
        { label: 'Tisanes & Plantes CI',    href: 'catalogue.html?cat=tisanes' },
        { label: 'Materiel medical',        href: 'catalogue.html?cat=medical' },
      ]
    },
    {
      id: 'beaute', label: 'Beaute & Soins', count: '640',
      icon: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
      sub: [
        { label: 'Soins visage',           href: 'catalogue.html?cat=soins-visage' },
        { label: 'Soins corps',            href: 'catalogue.html?cat=soins-corps' },
        { label: 'Maquillage',             href: 'catalogue.html?cat=maquillage' },
        { label: 'Soins cheveux naturels', href: 'catalogue.html?cat=cheveux' },
        { label: 'Parfums & Deodorants',   href: 'catalogue.html?cat=parfums' },
        { label: 'Rasage homme',           href: 'catalogue.html?cat=rasage' },
      ]
    },
    {
      id: 'alimentation', label: 'Alimentation', count: '510',
      icon: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
      sub: [
        { label: 'Epices & Condiments CI', href: 'catalogue.html?cat=epices' },
        { label: 'Huiles & Graisses',      href: 'catalogue.html?cat=huiles' },
        { label: 'Cereales & Farines',     href: 'catalogue.html?cat=cereales' },
        { label: 'Conserves & Bocaux',     href: 'catalogue.html?cat=conserves' },
        { label: 'The & Infusions',        href: 'catalogue.html?cat=the' },
        { label: 'Produits bio locaux',    href: 'catalogue.html?cat=bio' },
      ]
    },
    {
      id: 'sport', label: 'Sport & Loisirs', count: '420',
      icon: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>',
      sub: [
        { label: 'Football & Maillots',    href: 'catalogue.html?cat=football' },
        { label: 'Fitness & Musculation',  href: 'catalogue.html?cat=fitness' },
        { label: 'Arts martiaux',          href: 'catalogue.html?cat=arts-martiaux' },
        { label: 'Natation & Plage',       href: 'catalogue.html?cat=natation' },
        { label: 'Jeux & Jouets',          href: 'catalogue.html?cat=jouets' },
        { label: 'Livres & Papeterie',     href: 'catalogue.html?cat=livres' },
      ]
    },
    {
      id: 'auto', label: 'Auto & Moto', count: '390',
      icon: '<rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
      sub: [
        { label: 'Pieces detachees auto',  href: 'catalogue.html?cat=pieces-auto' },
        { label: 'Accessoires voiture',    href: 'catalogue.html?cat=acc-voiture' },
        { label: 'Pieces moto',            href: 'catalogue.html?cat=pieces-moto' },
        { label: 'Huiles & Lubrifiants',   href: 'catalogue.html?cat=lubrifiants' },
        { label: 'GPS & Electronique auto',href: 'catalogue.html?cat=gps' },
        { label: 'Pneus & Jantes',         href: 'catalogue.html?cat=pneus' },
      ]
    },
    {
      id: 'bureau', label: 'Bureau & Pro', count: '280',
      icon: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
      sub: [
        { label: 'Mobilier de bureau',     href: 'catalogue.html?cat=mobilier-bureau' },
        { label: 'Fournitures scolaires',  href: 'catalogue.html?cat=fournitures' },
        { label: 'Impression & Copie',     href: 'catalogue.html?cat=impression' },
        { label: 'Materiel BTP',           href: 'catalogue.html?cat=btp' },
        { label: 'Agriculture & Elevage',  href: 'catalogue.html?cat=agriculture' },
        { label: 'Hygiene & Entretien',    href: 'catalogue.html?cat=hygiene' },
      ]
    },
  ];

  /* ── HTML MEGA COLONNES ── */
  const megaLeft = MEGA_CATS.map((cat, i) => `
    <a class="mega-left-item${i === 0 ? ' active' : ''}"
       href="${b}catalogue.html?cat=${cat.id}"
       data-cat="${cat.id}"
       onmouseenter="mcpMegaHover('${cat.id}')">
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="1.8">${cat.icon}</svg>
      ${cat.label}
      <span class="mega-left-item-count">${cat.count}</span>
    </a>
    ${cat.id === 'electronique' || cat.id === 'mode' || cat.id === 'sport' ? '<div class="mega-left-sep"></div>' : ''}
  `).join('');

  const megaRight = MEGA_CATS.map((cat, i) => `
    <div class="mega-right-section${i === 0 ? ' active' : ''}" id="mega-right-${cat.id}">
      <div class="mega-right-title">${cat.label}</div>
      <div class="mega-sub-grid">
        ${cat.sub.map(s => `
          <a href="${b}${s.href}" class="mega-sub-link">
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            ${s.label}
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');

  /* ── HTML COMPLET DU HEADER ── */
  return `
<!-- BARRE PROMO TOP -->
<div class="nav-promo-bar">
  <div class="nav-promo-bar-item">
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    Livraison gratuite dès <span class="nav-promo-bar-highlight">&nbsp;15 000 FCFA</span>
  </div>
  <div class="nav-promo-bar-sep"></div>
  <div class="nav-promo-bar-item">
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    Paiements 100% sécurisés
  </div>
  <div class="nav-promo-bar-sep"></div>
  <div class="nav-promo-bar-item">
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
    Retour gratuit sous <span class="nav-promo-bar-highlight">&nbsp;7 jours</span>
  </div>
  <div class="nav-promo-bar-sep"></div>
  <div class="nav-promo-bar-item">
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"/><path d="M11 8.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
    Support <span class="nav-promo-bar-highlight">&nbsp;7j/7</span>
  </div>
</div>

<nav id="main-nav">
  <div class="nav-inner">

    <!-- LOGO -->
    <a href="${b}index.html" class="nav-brand" style="text-decoration:none">
      <div class="nav-brand-icon">${MCP_LOGO_SVG}</div>
      <div class="nav-brand-text">
        <div class="nav-brand-name">
          <span class="n-m">Market</span><span class="n-c">Center</span><span class="n-p">Place</span>
        </div>
        <span class="nav-brand-tag">Marketplace &mdash; Cote d'Ivoire</span>
      </div>
    </a>

    <!-- MENU PRINCIPAL -->
    <ul class="nav-menu">

      <!-- ═══ CATEGORIES MEGA MENU ═══ -->
      <li>
        <button class="nav-trigger">
          Catégories
          <svg class="nav-arrow-icon" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-drop mega">
          <div class="nav-drop-inner">
            <div class="mega-left">${megaLeft}</div>
            <div class="mega-right">
              ${megaRight}
              <div class="mega-promo-strip">
                <div class="mega-promo-text">Code <em>BIENVENUE10</em> — -10% sur votre 1ère commande</div>
                <a href="${b}catalogue.html" class="mega-promo-btn">Voir les offres</a>
              </div>
            </div>
          </div>
          <div class="nav-drop-footer">
            <a href="${b}catalogue.html">Voir tout le catalogue &rarr;</a>
            <span class="nav-drop-footer-stats">12 450 produits disponibles</span>
          </div>
        </div>
      </li>

      <!-- ═══ VENDEURS ═══ -->
      <li>
        <button class="nav-trigger">
          Vendeurs
          <svg class="nav-arrow-icon" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-drop rich">
          <div class="nav-drop-section-title">Découvrir</div>
          <a href="${b}index.html#vendeurs" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Nos vendeurs certifiés
            <span class="nav-drop-link-tag">180+</span>
          </a>
          <a href="${b}catalogue.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Meilleures boutiques
          </a>
          <a href="${b}catalogue.html?nouveaux=1" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Nouveaux vendeurs
            <span class="nav-drop-link-badge green">Nouveau</span>
          </a>
          <div class="nav-drop-sep"></div>
          <div class="nav-drop-section-title">Vendre sur MCP</div>
          <a href="${b}connexion.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            Créer ma boutique
            <span class="nav-drop-link-badge">Gratuit</span>
          </a>
          <a href="${b}faq.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Tarifs et commissions
          </a>
          <a href="${b}vendeur/live.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
            Studio Live &amp; Vidéos
            <span class="nav-drop-link-tag">Pro</span>
          </a>
          <div class="nav-drop-sep"></div>
          <div class="nav-drop-section-title">Mon espace</div>
          <a href="${b}vendeur/dashboard.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Tableau de bord
          </a>
          <a href="${b}vendeur/produits.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>
            Mes produits
          </a>
          <a href="${b}vendeur/commandes.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
            Mes commandes
          </a>
          <a href="${b}vendeur/securite-vendeur.html" class="nav-drop-link" style="color:#16a34a">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            Guide sécurité vendeur
          </a>
        </div>
      </li>

      <!-- ═══ PROMOTIONS ═══ -->
      <li>
        <button class="nav-trigger">
          Promotions
          <svg class="nav-arrow-icon" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-drop rich">
          <div class="nav-drop-section-title">Offres en cours</div>
          <a href="${b}catalogue.html?promo=1" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Tous les produits en promo
            <span class="nav-drop-link-badge">-25%</span>
          </a>
          <a href="${b}catalogue.html?promo=flash" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Ventes flash du jour
            <span class="nav-drop-link-badge" style="background:#f59e0b">Flash</span>
          </a>
          <a href="${b}catalogue.html?promo=destock" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Déstockage
          </a>
          <div class="nav-drop-sep"></div>
          <div class="nav-drop-section-title">Codes promo</div>
          <a href="${b}catalogue.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>
            BIENVENUE10 — -10% 1ère commande
          </a>
          <a href="${b}catalogue.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>
            MCP2025 — -5 000 FCFA dès 50 000
          </a>
          <div class="nav-drop-sep"></div>
          <div class="nav-drop-section-title">Collections</div>
          <a href="${b}catalogue.html?collection=noel" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Cadeaux &amp; Occasions spéciales
          </a>
          <a href="${b}catalogue.html?collection=top" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            Top ventes du mois
          </a>
        </div>
      </li>

      <!-- ═══ SERVICES ═══ -->
      <li>
        <button class="nav-trigger">
          Services
          <svg class="nav-arrow-icon" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-drop rich">
          <div class="nav-drop-section-title">Livraison</div>
          <a href="${b}faq.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            Livraison Abidjan (24-48h)
          </a>
          <a href="${b}faq.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Livraison express (jour même)
          </a>
          <a href="${b}faq.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            Livraison nationale CI
          </a>
          <div class="nav-drop-sep"></div>
          <div class="nav-drop-section-title">Paiement</div>
          <a href="${b}securite.html#paiements" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Orange Money &amp; MTN Money
          </a>
          <a href="${b}securite.html#paiements" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Wave CI &amp; Moov Money
          </a>
          <a href="${b}securite.html#paiements" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Visa / Mastercard
          </a>
          <a href="${b}securite.html#paiements" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Paiement à la livraison
          </a>
          <div class="nav-drop-sep"></div>
          <div class="nav-drop-section-title">Garanties</div>
          <a href="${b}securite.html" class="nav-drop-link" style="color:#16a34a">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            Acheter en sécurité
          </a>
          <a href="${b}faq.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
            Retour &amp; Remboursement 7j
          </a>
        </div>
      </li>

      <!-- ═══ AIDE ═══ -->
      <li>
        <button class="nav-trigger">
          Aide
          <svg class="nav-arrow-icon" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-drop rich">
          <div class="nav-drop-section-title">Support</div>
          <a href="${b}faq.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            FAQ &amp; Centre d'aide
          </a>
          <a href="${b}contact.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Nous contacter
          </a>
          <a href="https://wa.me/2250700000000" target="_blank" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            WhatsApp direct
          </a>
          <div class="nav-drop-sep"></div>
          <div class="nav-drop-section-title">Informations</div>
          <a href="${b}securite.html" class="nav-drop-link" style="color:#16a34a;font-weight:700">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            Acheter en sécurité
          </a>
          <a href="${b}a-propos.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            A propos de MCP
          </a>
          <a href="${b}cgv.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            CGV &amp; Conditions
          </a>
          <a href="${b}mentions-legales.html" class="nav-drop-link">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Mentions légales
          </a>
        </div>
      </li>

    </ul>

    <!-- DROITE -->
    <div class="nav-right">

      <!-- Recherche -->
      <div class="nav-search-wrap">
        <svg class="nav-search-icon" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" class="nav-search" id="header-search-input"
          placeholder="Rechercher un produit..."
          onkeydown="if(event.key==='Enter' && this.value.trim()) window.location.href='${b}recherche.html?q='+encodeURIComponent(this.value.trim())"/>
      </div>

      <!-- Dark mode -->
      <button class="nav-dark-toggle" id="nav-dark-toggle" onclick="mcpToggleDark()" title="Mode sombre">
        <svg class="dark-icon-moon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="rgba(255,255,255,.75)"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg class="dark-icon-sun" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="rgba(255,255,255,.75)" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>

      <!-- Notifications -->
      <div class="nav-notif-wrap" id="nav-notif-wrap" style="display:none;position:relative">
        <button class="nav-btn-notif" id="nav-notif-btn" onclick="mcpToggleNotifPanel()" title="Notifications">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="rgba(255,255,255,.75)"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="nav-notif-badge" id="nav-notif-badge" style="display:none">0</span>
        </button>
        <div class="nav-notif-panel" id="nav-notif-panel" style="display:none">
          <div class="nav-notif-header">
            <span class="nav-notif-title">Notifications</span>
            <button onclick="mcpMarkAllRead()" class="nav-notif-read-all">Tout marquer lu</button>
          </div>
          <div class="nav-notif-list" id="nav-notif-list">
            <div class="nav-notif-empty">Aucune notification</div>
          </div>
        </div>
      </div>

      <!-- Connexion -->
      <a class="nav-btn-connexion" href="${b}connexion.html">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Connexion
      </a>

      <!-- Panier -->
      <a class="nav-btn-cart btn-cart" href="${b}panier.html">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        PANIER
        <span class="cart-count" style="display:none">0</span>
      </a>

    </div>
  </div>
</nav>
`;
}

/* ── MEGA MENU HOVER ── */
function mcpMegaHover(catId) {
  document.querySelectorAll('.mega-left-item').forEach(el => {
    el.classList.toggle('active', el.dataset.cat === catId);
  });
  document.querySelectorAll('.mega-right-section').forEach(el => {
    el.classList.toggle('active', el.id === 'mega-right-' + catId);
  });
}


function buildFooter() {
  const b = getBase();
  return `
<footer class="site-footer">
  <div class="site-footer-top">
    <div class="site-footer-brand">
      <a href="${b}index.html" style="display:flex;align-items:center;gap:10px;text-decoration:none;margin-bottom:1rem">
        <div style="width:32px;height:32px;flex-shrink:0">${MCP_LOGO_SVG}</div>
        <div style="font-family:Montserrat,sans-serif;font-weight:900;font-size:0.95rem;text-transform:uppercase">
          <span style="color:#fff">Market</span><span style="color:#e8282f">Center</span><span style="color:#c8a84b">Place</span>
        </div>
      </a>
      <p>La marketplace de reference pour toute la Cote d'Ivoire et l'Afrique de l'Ouest. Achetez et vendez en toute securite.</p>
    </div>
    <div class="site-footer-col">
      <h4>Acheter</h4>
      <ul>
        <li><a href="${b}catalogue.html">Toutes les categories</a></li>
        <li><a href="${b}catalogue.html">Sante &amp; Bien-etre</a></li>
        <li><a href="${b}catalogue.html">Offres du jour</a></li>
        <li><a href="${b}catalogue.html">Nouveautes</a></li>
      </ul>
    </div>
    <div class="site-footer-col">
      <h4>Vendre</h4>
      <ul>
        <li><a href="${b}connexion.html">Devenir vendeur</a></li>
        <li><a href="${b}faq.html">Tarifs et commissions</a></li>
        <li><a href="${b}vendeur/dashboard.html">Espace vendeur</a></li>
        <li><a href="${b}faq.html">Regles de vente</a></li>
      </ul>
    </div>
    <div class="site-footer-col">
      <h4>Aide</h4>
      <ul>
        <li><a href="${b}faq.html">FAQ</a></li>
        <li><a href="${b}securite.html" style="color:#4ade80;font-weight:700">Acheter en sécurité</a></li>
        <li><a href="${b}faq.html">Livraison et retours</a></li>
        <li><a href="${b}contact.html">Nous contacter</a></li>
        <li><a href="${b}a-propos.html">A propos</a></li>
        <li><a href="${b}cgv.html">Conditions generales</a></li>
        <li><a href="${b}mentions-legales.html">Mentions legales</a></li>
        <li><a href="${b}profil-vendeur.html">Profil vendeur</a></li>
      </ul>
    </div>
  </div>
  <div class="site-footer-bottom">
    <span class="site-footer-copy">&copy; 2025 Market Center Place &mdash; Abidjan, Cote d'Ivoire</span>
    <div class="site-footer-pay">
      <span class="pay-pill">Orange Money</span>
      <span class="pay-pill">MTN Money</span>
      <span class="pay-pill">Moov Money</span>
      <span class="pay-pill">Wave</span>
      <span class="pay-pill">Visa</span>
    </div>
  </div>
</footer>`;
}

/* ══ INJECTION ══ */
document.addEventListener('DOMContentLoaded', function() {

  /* Ajouter nav.css si pas deja charge */
  if (!document.getElementById('nav-css')) {
    const b   = getBase();
    const lnk = document.createElement('link');
    lnk.id    = 'nav-css';
    lnk.rel   = 'stylesheet';
    lnk.href  = b + 'nav.css';
    document.head.appendChild(lnk);
  }

  /* Header */
  const slot = document.getElementById('header-slot');
  if (slot) {
    const page = slot.dataset.page || '';
    slot.outerHTML = buildHeader(page);
  }

  /* Footer */
  const fslot = document.getElementById('footer-slot');
  if (fslot) fslot.outerHTML = buildFooter();

  /* Init */
  mcpInitCursor();
  mcpInitProgress();
  mcpInitReveal();
  mcpInitRipple();
  mcpInitDropdowns();
  mcpUpdateCart();

  /* Loader */
  function hideLoader() {
    var l = document.getElementById('loader');
    if (!l) return;
    l.style.transition = 'opacity 0.5s, visibility 0.5s';
    l.style.opacity    = '0';
    l.style.visibility = 'hidden';
    setTimeout(function() { if (l && l.parentNode) l.parentNode.removeChild(l); }, 600);
  }
  window.addEventListener('load', function() { setTimeout(hideLoader, 1400); });
  setTimeout(hideLoader, 3000);
});

/* ── DROPDOWNS (click) ── */
function mcpInitDropdowns() {
  /* Attendre que le DOM soit stable apres injection */
  setTimeout(function() {
    var items = document.querySelectorAll('#main-nav .nav-menu > li');

    /* Init mega hover — activer la 1ère catégorie par défaut */
    var firstLeft = document.querySelector('.mega-left-item');
    if (firstLeft) {
      var firstCat = firstLeft.dataset.cat;
      if (firstCat) mcpMegaHover(firstCat);
    }

    /* Keyboard nav pour le mega menu */
    document.querySelectorAll('.mega-left-item').forEach(function(item) {
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          mcpMegaHover(this.dataset.cat);
        }
      });
    });

    items.forEach(function(li) {
      var btn = li.querySelector('.nav-trigger');
      if (!btn) return;
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var wasOpen = li.classList.contains('open');
        items.forEach(function(x) { x.classList.remove('open'); });
        if (!wasOpen) li.classList.add('open');
      });
    });
    document.addEventListener('click', function() {
      items.forEach(function(li) { li.classList.remove('open'); });
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') items.forEach(function(li) { li.classList.remove('open'); });
    });
  }, 100);
}

/* ── MENU MOBILE ── */
function mcpToggleMobile() {
  var menu   = document.getElementById('nav-mobile');
  var burger = document.getElementById('nav-burger');
  if (!menu || !burger) return;
  var open = menu.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  // Empêcher le scroll body quand menu ouvert
  document.body.style.overflow = open ? 'hidden' : '';
}

// Fermer menu mobile au clic sur un lien
document.addEventListener('click', function(e) {
  if (e.target.closest('.nav-mobile a')) {
    var menu = document.getElementById('nav-mobile');
    var burger = document.getElementById('nav-burger');
    if (menu) { menu.classList.remove('open'); }
    if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }
    document.body.style.overflow = '';
  }
});

/* ── CURSEUR ── */
function mcpInitCursor() {
  var cursor = document.getElementById('cursor');
  var ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;
  var mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', function(e) { mx=e.clientX; my=e.clientY; });
  (function loop() {
    cursor.style.left = mx+'px'; cursor.style.top = my+'px';
    rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(loop);
  })();
}

/* ── PROGRESS ── */
function mcpInitProgress() {
  var bar = document.getElementById('progress');
  if (!bar) return;
  window.addEventListener('scroll', function() {
    var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  });
}

/* ── REVEAL ── */
function mcpInitReveal() {
  var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(function(el) { obs.observe(el); });
}

/* ── RIPPLE ── */
function mcpInitRipple() {
  document.querySelectorAll('.btn-submit, .btn-add, .btn-send, .nav-btn-panier').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var rect = this.getBoundingClientRect();
      var d = Math.max(rect.width, rect.height);
      var r = document.createElement('span');
      r.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.22);width:'+d+'px;height:'+d+'px;left:'+(e.clientX-rect.left-d/2)+'px;top:'+(e.clientY-rect.top-d/2)+'px;transform:scale(0);animation:ripple .5s ease-out;pointer-events:none';
      this.style.position='relative'; this.style.overflow='hidden';
      this.appendChild(r); setTimeout(function(){r.remove();},550);
    });
  });
}

/* ── PANIER ── */
function mcpUpdateCart() {
  try {
    var items = JSON.parse(localStorage.getItem('mcp_cart') || '[]');
    var count = items.reduce(function(a,i) { return a+(i.qty||1); }, 0);
    var badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
  } catch(e) {}
}

/* Alias pour compatibilite avec les pages existantes */
var initCursor   = mcpInitCursor;
var initProgress = mcpInitProgress;
var initReveal   = mcpInitReveal;
var initRipple   = mcpInitRipple;
var updateCartBadge = mcpUpdateCart;
var toggleMobileMenu = mcpToggleMobile;

const Cart = {
  get() { try { return JSON.parse(localStorage.getItem('mcp_cart')||'[]'); } catch(e){return[];} },
  save(items) { localStorage.setItem('mcp_cart', JSON.stringify(items)); },
  count() { return this.get().reduce(function(a,i){return a+(i.qty||1);},0); },
  add(product) {
    var items = this.get();
    var found = items.find(function(i){return i.id===product.id;});
    if (found) found.qty = (found.qty||1)+1;
    else items.push(Object.assign({qty:1}, product));
    this.save(items);
    mcpUpdateCart();
  },
  updateBadge() { mcpUpdateCart(); }
};

/* ── NOTIFICATIONS ─────────────────────────────────────── */
function mcpLoadNotifications() {
  if (!MCP_API || !MCP_API.isLoggedIn()) return;
  const wrap = document.getElementById('nav-notif-wrap');
  if (wrap) wrap.style.display = 'flex';

  MCP_API.request('GET', '/notifications', null, true).then(data => {
    if (!data) return;
    const badge = document.getElementById('nav-notif-badge');
    const list  = document.getElementById('nav-notif-list');
    if (badge) {
      if (data.unread > 0) { badge.textContent = data.unread > 9 ? '9+' : data.unread; badge.style.display = 'flex'; }
      else badge.style.display = 'none';
    }
    if (list && data.data) {
      if (!data.data.length) { list.innerHTML = '<div class="nav-notif-empty">Aucune notification</div>'; return; }
      list.innerHTML = data.data.slice(0, 6).map(n => `
        <div class="nav-notif-item ${n.lue ? '' : 'unread'}">
          <div class="nav-notif-dot"></div>
          <div class="nav-notif-content">
            <div class="nav-notif-msg">${n.titre || n.message || n.type}</div>
            <div class="nav-notif-time">${new Date(n.created_at).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>`).join('');
    }
  }).catch(() => {});
}

function mcpToggleNotifPanel() {
  const panel = document.getElementById('nav-notif-panel');
  if (!panel) return;
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) mcpLoadNotifications();
}

function mcpMarkAllRead() {
  if (!MCP_API || !MCP_API.isLoggedIn()) return;
  MCP_API.request('PUT', '/notifications/read', null, true).then(() => {
    const badge = document.getElementById('nav-notif-badge');
    if (badge) badge.style.display = 'none';
    document.querySelectorAll('.nav-notif-item.unread').forEach(el => el.classList.remove('unread'));
    const panel = document.getElementById('nav-notif-panel');
    if (panel) panel.style.display = 'none';
  }).catch(() => {});
}

// Fermer panneau au clic externe
document.addEventListener('click', function(e) {
  const wrap = document.getElementById('nav-notif-wrap');
  if (wrap && !wrap.contains(e.target)) {
    const panel = document.getElementById('nav-notif-panel');
    if (panel) panel.style.display = 'none';
  }
});

/* ── DARK MODE ─────────────────────────────────────────── */
function mcpToggleDark() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('mcp_theme', newTheme);

  const moon = document.querySelector('.dark-icon-moon');
  const sun  = document.querySelector('.dark-icon-sun');
  if (moon) moon.style.display = isDark ? 'block' : 'none';
  if (sun)  sun.style.display  = isDark ? 'none' : 'block';
}

function mcpInitTheme() {
  const saved = localStorage.getItem('mcp_theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    const moon = document.querySelector('.dark-icon-moon');
    const sun  = document.querySelector('.dark-icon-sun');
    if (moon) moon.style.display = 'none';
    if (sun)  sun.style.display  = 'block';
  }
}
