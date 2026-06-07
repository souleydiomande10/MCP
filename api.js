/* ============================================================
   MARKET CENTER PLACE — api.js
   Client HTTP — connecte toutes les pages au backend
   À inclure sur toutes les pages : <script src="api.js"></script>
   ============================================================ */

const MCP_API = (() => {

  // ── CONFIGURATION ────────────────────────────────────────
  const BASE_URL = 'http://localhost:3000/api'; // → remplacer par https://marketcenterplace.ci/api en prod

  // ── TOKEN JWT ────────────────────────────────────────────
  function getToken()       { return localStorage.getItem('mcp_token'); }
  function setToken(t)      { localStorage.setItem('mcp_token', t); }
  function removeToken()    { localStorage.removeItem('mcp_token'); localStorage.removeItem('mcp_user'); }
  function getUser()        { try { return JSON.parse(localStorage.getItem('mcp_user')); } catch { return null; } }
  function setUser(u)       { localStorage.setItem('mcp_user', JSON.stringify(u)); }
  function isLoggedIn()     { return !!getToken(); }
  function isVendeur()      { return getUser()?.role === 'vendeur'; }

  // ── REQUÊTE HTTP ─────────────────────────────────────────
  async function request(method, endpoint, data = null, auth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = getToken();
      if (!token) { window.location.href = '/connexion.html'; return; }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (data && method !== 'GET') options.body = JSON.stringify(data);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const json = await response.json();

      if (response.status === 401) {
        removeToken();
        window.location.href = '/connexion.html';
        return;
      }
      if (!response.ok) throw { status: response.status, ...json };
      return json;
    } catch (err) {
      if (err.status) throw err;
      throw { error: 'Impossible de contacter le serveur. Vérifiez votre connexion.' };
    }
  }

  // ── AUTH ─────────────────────────────────────────────────
  async function register(data) {
    const res = await request('POST', '/auth/register', data);
    if (res.token) { setToken(res.token); setUser(res.user); }
    return res;
  }

  async function login(email, password) {
    const res = await request('POST', '/auth/login', { email, password });
    if (res.token) { setToken(res.token); setUser(res.user); }
    return res;
  }

  function logout() {
    removeToken();
    window.location.href = '/index.html';
  }

  async function getMe() {
    return request('GET', '/auth/me', null, true);
  }

  // ── PRODUITS ─────────────────────────────────────────────
  async function getProducts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/products${qs ? '?' + qs : ''}`);
  }

  async function getProduct(slug) {
    return request('GET', `/products/${slug}`);
  }

  // ── COMMANDES ────────────────────────────────────────────
  async function createOrder(orderData) {
    return request('POST', '/orders', orderData, true);
  }

  async function getMyOrders(page = 1) {
    return request('GET', `/orders/my?page=${page}`, null, true);
  }

  async function getOrder(ref) {
    return request('GET', `/orders/${ref}`, null, true);
  }

  // ── VENDEUR ──────────────────────────────────────────────
  async function getVendorDashboard() {
    return request('GET', '/vendor/dashboard', null, true);
  }

  async function getVendorProducts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/vendor/products${qs ? '?' + qs : ''}`, null, true);
  }

  async function updateOrderItemStatus(itemId, statut) {
    return request('PUT', `/vendor/orders/${itemId}/status`, { statut }, true);
  }

  // ── FAVORIS ──────────────────────────────────────────────
  async function toggleWishlist(produitId) {
    return request('POST', '/wishlist/toggle', { produit_id: produitId }, true);
  }

  async function getWishlist() {
    return request('GET', '/wishlist', null, true);
  }

  // ── AVIS ─────────────────────────────────────────────────
  async function postReview(data) {
    return request('POST', '/reviews', data, true);
  }

  // ── CATÉGORIES ───────────────────────────────────────────
  async function getCategories() {
    return request('GET', '/categories');
  }


  // ── OAUTH SOCIAL ─────────────────────────────────────────
  function socialAuth(provider) {
    // Rediriger vers le backend OAuth
    window.location.href = BASE_URL + '/auth/' + provider;
  }

  // Récupérer le token depuis l'URL après callback OAuth
  function handleOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    const social = params.get('social');
    const error  = params.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return false;
    }
    if (token) {
      setToken(token);
      // Nettoyer l'URL
      const clean = window.location.href.split('?')[0];
      window.history.replaceState({}, document.title, clean);
      return true;
    }
    return false;
  }

  // ── 2FA ──────────────────────────────────────────────────
  async function send2FA(userId, method = 'sms') {
    return request('POST', '/auth/2fa/send', { userId, method });
  }

  async function verify2FA(userId, code) {
    const res = await request('POST', '/auth/2fa/verify', { userId, code });
    if (res.token) { setToken(res.token); setUser(res.user); }
    return res;
  }

  // ── WHATSAPP AUTH ─────────────────────────────────────────
  async function sendWhatsAppOTP(telephone) {
    return request('POST', '/auth/whatsapp/send-otp', { telephone });
  }

  async function verifyWhatsAppOTP(telephone, otp) {
    const res = await request('POST', '/auth/whatsapp/verify', { telephone, otp });
    if (res.token) { setToken(res.token); setUser(res.user); }
    return res;
  }

  // ── PUBLIC ───────────────────────────────────────────────
  return {
    // Auth
    register, login, logout, getMe, isLoggedIn, isVendeur, getUser,
    // Produits
    getProducts, getProduct,
    // Commandes
    createOrder, getMyOrders, getOrder,
    // Vendeur
    getVendorDashboard, getVendorProducts, updateOrderItemStatus,
    // Favoris
    toggleWishlist, getWishlist,
    // Avis
    postReview,
    // Catégories
    getCategories,
    // OAuth + 2FA
    socialAuth, handleOAuthCallback, send2FA, verify2FA, sendWhatsAppOTP, verifyWhatsAppOTP,
    // Config
    BASE_URL,
  };

})();

/* ── MISE À JOUR HEADER SELON CONNEXION ──────────────────────
   Appelé automatiquement par components.js
   Mettre à jour le bouton connexion/compte dans le nav       */
function mcpUpdateAuthState() {
  const user = MCP_API.getUser();
  if (!user) return;

  // Remplacer "Connexion" par prénom de l'utilisateur
  const btnConn = document.querySelector('.nav-btn-connexion');
  if (btnConn) {
    btnConn.innerHTML = `
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
      ${user.prenom}`;
    btnConn.href = 'compte.html';

    // Si vendeur → ajouter lien dashboard
    if (user.role === 'vendeur') {
      const nav = btnConn.closest('.nav-right-group');
      if (nav && !nav.querySelector('.nav-btn-vendeur')) {
        const vendeurBtn = document.createElement('a');
        vendeurBtn.className = 'nav-btn-connexion nav-btn-vendeur';
        vendeurBtn.href = 'vendeur/dashboard.html';
        vendeurBtn.style.background = 'rgba(22,163,74,0.15)';
        vendeurBtn.style.borderColor = 'rgba(22,163,74,0.4)';
        vendeurBtn.style.color = '#4ade80';
        vendeurBtn.textContent = 'Espace vendeur';
        nav.insertBefore(vendeurBtn, btnConn);
      }
    }
  }
}

// Appeler au chargement
document.addEventListener('DOMContentLoaded', mcpUpdateAuthState);
