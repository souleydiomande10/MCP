// ============================================================
// MARKET CENTER PLACE — API REST Node.js + Express
// Version sécurisée avec protections anti-hackers
// ============================================================
// Installation :
//   npm install express mysql2 bcryptjs jsonwebtoken cors dotenv
//               helmet express-rate-limit express-validator
//               morgan compression multer nodemailer crypto
// ============================================================

"use strict";

const express      = require("express");
const mysql        = require("mysql2/promise");
const bcrypt       = require("bcryptjs");
const jwt          = require("jsonwebtoken");
const cors         = require("cors");
const helmet       = require("helmet");
const rateLimit    = require("express-rate-limit");
const morgan       = require("morgan");
const compression  = require("compression");
const crypto       = require("crypto");
const { body, param, validationResult } = require("express-validator");
require("dotenv").config();

/* ════════════════════════════════════════════════════════
   APPLICATION EXPRESS
════════════════════════════════════════════════════════ */
const app  = express();
const PORT = process.env.PORT || 5000;

/* ════════════════════════════════════════════════════════
   MIDDLEWARES SÉCURITÉ — NIVEAU 1
════════════════════════════════════════════════════════ */

/* 1. Helmet — Headers HTTP sécurisés */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "https://cdnjs.cloudflare.com"],
      styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc:     ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://api.cinetpay.com", "https://api.wave.com"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));

/* 2. CORS — Autoriser seulement le domaine MCP */
const ALLOWED_ORIGINS = [
  "https://marketcenterplace.ci",
  "https://www.marketcenterplace.ci",
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
  process.env.NODE_ENV === "development" ? "http://localhost:5500" : null,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error("CORS: origine non autorisée — " + origin));
  },
  methods:     ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  credentials: true,
  maxAge:      86400,
}));

/* 3. Parsers */
app.use(express.json({ limit: "10kb" })); // Limite 10kb pour éviter les payloads géants
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/* 4. Compression */
app.use(compression());

/* 5. Logs avec Morgan */
const fs   = require("fs");
const path = require("path");
if (!fs.existsSync("logs")) fs.mkdirSync("logs");
const accessLog = fs.createWriteStream(path.join("logs", "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLog }));
app.use(morgan("dev")); // Console en dev

/* ════════════════════════════════════════════════════════
   RATE LIMITING — PROTECTION BRUTE FORCE
════════════════════════════════════════════════════════ */

/* Limite globale : 200 requêtes par 15 minutes par IP */
const globalLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      200,
  message:  { error: "Trop de requêtes. Réessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders:   false,
});
app.use(globalLimit);

/* Limite stricte sur la connexion : 5 tentatives par 15 min */
const loginLimit = rateLimit({
  windowMs:  15 * 60 * 1000,
  max:        5,
  message:   { error: "Trop de tentatives de connexion. Compte bloqué 15 minutes." },
  skipSuccessfulRequests: true,
});

/* Limite sur les inscriptions : 3 par heure */
const registerLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:       3,
  message:  { error: "Trop d'inscriptions depuis cette IP." },
});

/* Limite sur les SMS OTP : 3 par heure */
const smsLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:       3,
  message:  { error: "Trop de codes SMS demandés. Réessayez dans 1 heure." },
});

/* ════════════════════════════════════════════════════════
   BASE DE DONNÉES MySQL
════════════════════════════════════════════════════════ */
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || "127.0.0.1",
  user:               process.env.DB_USER     || "mcp_user",
  password:           process.env.DB_PASSWORD || "",
  database:           process.env.DB_NAME     || "mcp_db",
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  ssl:                process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : false,
  charset:            "utf8mb4",
});

/* Test de connexion au démarrage */
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✓ MySQL connecté — base de données MCP");
    conn.release();
  } catch (err) {
    console.error("✗ Erreur MySQL :", err.message);
    process.exit(1);
  }
})();

/* ════════════════════════════════════════════════════════
   HELPER — VALIDATION EXPRESS-VALIDATOR
════════════════════════════════════════════════════════ */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

/* Sanitiser les inputs (supprimer HTML dangereux) */
const sanitize = (str) => {
  if (typeof str !== "string") return str;
  return str
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/* ════════════════════════════════════════════════════════
   AUTHENTIFICATION JWT
════════════════════════════════════════════════════════ */
const JWT_SECRET  = process.env.JWT_SECRET  || "CHANGE_MOI_EN_PRODUCTION_32_CHARS_MIN";
const JWT_REFRESH = process.env.JWT_REFRESH || "CHANGE_MOI_REFRESH_32_CHARS_MIN";

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  const access  = jwt.sign(payload, JWT_SECRET,  { expiresIn: "8h",  issuer: "mcp-api" });
  const refresh = jwt.sign(payload, JWT_REFRESH, { expiresIn: "30d", issuer: "mcp-api" });
  return { access, refresh };
};

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }
  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, JWT_SECRET, { issuer: "mcp-api" });
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expirée. Reconnectez-vous." });
    }
    return res.status(401).json({ error: "Token invalide" });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: "Accès refusé" });
  }
  next();
};

/* ════════════════════════════════════════════════════════
   GESTION DES COMPTES BLOQUÉS
════════════════════════════════════════════════════════ */
const loginAttempts = new Map();

const checkAccountLocked = (email) => {
  const data = loginAttempts.get(email);
  if (!data) return false;
  if (Date.now() > data.lockUntil) { loginAttempts.delete(email); return false; }
  return data.locked;
};

const recordFailedLogin = (email) => {
  const data = loginAttempts.get(email) || { count: 0, locked: false, lockUntil: 0 };
  data.count++;
  if (data.count >= 5) {
    data.locked    = true;
    data.lockUntil = Date.now() + 30 * 60 * 1000; // 30 min
    console.warn(`[SÉCURITÉ] Compte bloqué après 5 tentatives : ${email}`);
  }
  loginAttempts.set(email, data);
};

const resetLoginAttempts = (email) => loginAttempts.delete(email);

/* ════════════════════════════════════════════════════════
   STOCKAGE OTP SMS (en prod : utiliser Redis)
════════════════════════════════════════════════════════ */
const smsOtpStore = new Map();

/* ════════════════════════════════════════════════════════
   COMMISSION PAR CATÉGORIE
════════════════════════════════════════════════════════ */
const COMMISSIONS = {
  electronique: 0.05,
  mode:         0.05,
  beaute:       0.04,
  alimentation: 0.02,
  maison:       0.04,
  auto:         0.03,
  services:     0.05,
  default:      0.04,
};

/* ════════════════════════════════════════════════════════
   CADEAUX VIRTUELS LIVE
════════════════════════════════════════════════════════ */
const GIFTS = {
  flame:   { name:"Flamme",   price_fcfa:500,   mcp_cut:0.40 },
  star:    { name:"Étoile",   price_fcfa:1000,  mcp_cut:0.40 },
  diamond: { name:"Diamant",  price_fcfa:2000,  mcp_cut:0.35 },
  crown:   { name:"Couronne", price_fcfa:5000,  mcp_cut:0.35 },
  lion:    { name:"Lion",     price_fcfa:10000, mcp_cut:0.30 },
  rocket:  { name:"Fusée",    price_fcfa:25000, mcp_cut:0.30 },
};

/* ════════════════════════════════════════════════════════
   PROGRAMME FIDÉLITÉ
════════════════════════════════════════════════════════ */
const POINTS_RULES = {
  achat_100fcfa:  1,
  parrainage:     500,
  avis_laisse:    50,
  profil_complet: 200,
  live_regarde:   20,
  inscription:    100,
};

const NIVEAUX = [
  { nom:"Bronze",  min:0,    max:499,      bonus_pct:0  },
  { nom:"Argent",  min:500,  max:1999,     bonus_pct:5  },
  { nom:"Or",      min:2000, max:4999,     bonus_pct:10 },
  { nom:"Platine", min:5000, max:Infinity, bonus_pct:15 },
];

const getNiveau = (pts) => NIVEAUX.find(n => pts >= n.min && pts <= n.max) || NIVEAUX[0];

/* ════════════════════════════════════════════════════════
   ROUTE DE SANTÉ
════════════════════════════════════════════════════════ */
app.get("/health", (req, res) => {
  res.json({ status:"ok", version:"2.0.0", timestamp: new Date().toISOString() });
});

/* ════════════════════════════════════════════════════════
   AUTH — INSCRIPTION
════════════════════════════════════════════════════════ */
app.post("/api/auth/register",
  registerLimit,
  [
    body("prenom").trim().notEmpty().withMessage("Prénom requis").isLength({ max:50 }).escape(),
    body("nom").trim().notEmpty().withMessage("Nom requis").isLength({ max:50 }).escape(),
    body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
    body("telephone").trim().notEmpty().matches(/^[+0-9\s]{8,15}$/).withMessage("Téléphone invalide"),
    body("password").isLength({ min:8 }).withMessage("Mot de passe minimum 8 caractères")
      .matches(/[A-Z]/).withMessage("Doit contenir une majuscule")
      .matches(/[0-9]/).withMessage("Doit contenir un chiffre"),
    body("role").optional().isIn(["acheteur","vendeur"]).withMessage("Rôle invalide"),
  ],
  validate,
  async (req, res) => {
    try {
      const { prenom, nom, email, telephone, password, role = "acheteur", nom_boutique } = req.body;

      // Vérifier si email déjà utilisé
      const [existing] = await pool.query(
        "SELECT id FROM users WHERE email = ?", [email]
      );
      if (existing.length > 0) {
        return res.status(409).json({ error: "Email déjà utilisé" });
      }

      // Hasher le mot de passe
      const hash = await bcrypt.hash(password, 12);

      // Créer l'utilisateur
      const [result] = await pool.query(
        `INSERT INTO users (prenom, nom, email, telephone, password_hash, role, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [sanitize(prenom), sanitize(nom), email, telephone, hash, role]
      );
      const userId = result.insertId;

      // Créditer points d'inscription
      await pool.query(
        `INSERT INTO points_fidelite (user_id, type, points, description, created_at)
         VALUES (?, 'credit', ?, 'Inscription', NOW())`,
        [userId, POINTS_RULES.inscription]
      );

      // Créer boutique si vendeur
      if (role === "vendeur" && nom_boutique) {
        await pool.query(
          `INSERT INTO vendeurs (user_id, nom_boutique, statut, created_at)
           VALUES (?, ?, 'en_attente', NOW())`,
          [userId, sanitize(nom_boutique)]
        );
      }

      const tokens = generateTokens({ id: userId, email, role });

      res.status(201).json({
        message: "Compte créé avec succès",
        user: { id: userId, prenom, nom, email, role },
        tokens,
      });
    } catch (err) {
      console.error("[REGISTER]", err.message);
      res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
  }
);

/* ════════════════════════════════════════════════════════
   AUTH — CONNEXION
════════════════════════════════════════════════════════ */
app.post("/api/auth/login",
  loginLimit,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().isLength({ max:100 }),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Vérifier si compte bloqué
      if (checkAccountLocked(email)) {
        return res.status(429).json({ error: "Compte bloqué après trop de tentatives. Réessayez dans 30 minutes." });
      }

      // Chercher l'utilisateur
      const [rows] = await pool.query(
        "SELECT id, prenom, nom, email, password_hash, role, is_active FROM users WHERE email = ?",
        [email]
      );

      if (rows.length === 0) {
        recordFailedLogin(email);
        return res.status(401).json({ error: "Identifiants incorrects" });
      }

      const user = rows[0];

      if (!user.is_active) {
        return res.status(403).json({ error: "Compte désactivé. Contactez le support." });
      }

      // Vérifier le mot de passe
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        recordFailedLogin(email);
        return res.status(401).json({ error: "Identifiants incorrects" });
      }

      resetLoginAttempts(email);

      // Mettre à jour la dernière connexion
      await pool.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);

      const tokens = generateTokens(user);

      // Forcer le 2FA pour les vendeurs
      const require2FA = user.role === "vendeur";

      res.json({
        message: "Connexion réussie",
        user: { id: user.id, prenom: user.prenom, nom: user.nom, email: user.email, role: user.role },
        tokens,
        require_2fa: require2FA,
      });
    } catch (err) {
      console.error("[LOGIN]", err.message);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
);

/* ════════════════════════════════════════════════════════
   AUTH — REFRESH TOKEN
════════════════════════════════════════════════════════ */
app.post("/api/auth/refresh", async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(400).json({ error: "Refresh token manquant" });
  try {
    const payload = jwt.verify(refresh_token, JWT_REFRESH, { issuer: "mcp-api" });
    const tokens  = generateTokens(payload);
    res.json({ tokens });
  } catch {
    res.status(401).json({ error: "Refresh token invalide ou expiré" });
  }
});

/* ════════════════════════════════════════════════════════
   AUTH — MOI
════════════════════════════════════════════════════════ */
app.get("/api/auth/me", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, prenom, nom, email, telephone, role, avatar, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ════════════════════════════════════════════════════════
   SMS OTP — ENVOI
════════════════════════════════════════════════════════ */
app.post("/api/auth/sms/send", smsLimit, async (req, res) => {
  try {
    const { telephone } = req.body;
    if (!telephone || telephone.replace(/[^0-9]/g,"").length < 8) {
      return res.status(400).json({ error: "Numéro de téléphone invalide" });
    }

    const code    = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 2 * 60 * 1000;
    smsOtpStore.set(telephone, { code, expires, attempts: 0 });

    /* En production — décommenter Orange CI ou Twilio :
    const twilio = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    await twilio.messages.create({
      body: "MCP : votre code est " + code + ". Valable 2 minutes.",
      from: process.env.TWILIO_PHONE,
      to:   telephone,
    });
    */

    console.log(`[SMS OTP] ${telephone} → ${code}`);

    res.json({
      success: true,
      message: "Code envoyé",
      debug_code: process.env.NODE_ENV === "development" ? code : undefined,
    });
  } catch (err) {
    console.error("[SMS]", err.message);
    res.status(500).json({ error: "Impossible d'envoyer le SMS" });
  }
});

/* ════════════════════════════════════════════════════════
   SMS OTP — VÉRIFICATION
════════════════════════════════════════════════════════ */
app.post("/api/auth/sms/verify", async (req, res) => {
  try {
    const { telephone, code } = req.body;
    const stored = smsOtpStore.get(telephone);
    if (!stored)              return res.status(400).json({ error: "Aucun code pour ce numéro" });
    if (Date.now() > stored.expires) { smsOtpStore.delete(telephone); return res.status(400).json({ error: "Code expiré" }); }
    stored.attempts++;
    if (stored.attempts > 3) { smsOtpStore.delete(telephone); return res.status(400).json({ error: "Trop de tentatives" }); }
    if (stored.code !== String(code).trim()) return res.status(400).json({ error: "Code incorrect", attempts_left: 3 - stored.attempts });
    smsOtpStore.delete(telephone);
    const verify_token = crypto.randomBytes(32).toString("hex");
    res.json({ success: true, message: "Numéro vérifié", verify_token });
  } catch (err) {
    res.status(500).json({ error: "Erreur vérification" });
  }
});

/* ════════════════════════════════════════════════════════
   PRODUITS
════════════════════════════════════════════════════════ */
app.get("/api/products", async (req, res) => {
  try {
    const { category, min_price, max_price, search, page = 1, limit = 20, sort = "recent" } = req.query;
    const offset = (Math.max(1, parseInt(page)) - 1) * Math.min(50, parseInt(limit));
    const params = [];
    let where = "WHERE p.statut = 'actif'";

    if (category) { where += " AND p.categorie = ?"; params.push(sanitize(category)); }
    if (min_price) { where += " AND p.prix >= ?"; params.push(parseFloat(min_price)); }
    if (max_price) { where += " AND p.prix <= ?"; params.push(parseFloat(max_price)); }
    if (search) {
      where += " AND (p.nom LIKE ? OR p.description LIKE ?)";
      const s = "%" + sanitize(search) + "%";
      params.push(s, s);
    }

    const order = sort === "price_asc"  ? "p.prix ASC"
                : sort === "price_desc" ? "p.prix DESC"
                : sort === "popular"    ? "p.total_ventes DESC"
                : "p.created_at DESC";

    const [products] = await pool.query(
      `SELECT p.id, p.nom, p.prix, p.stock, p.categorie, p.images,
              v.nom_boutique, v.logo AS vendeur_logo, v.note_moyenne
       FROM produits p
       JOIN vendeurs v ON v.id = p.vendeur_id
       ${where}
       ORDER BY ${order}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM produits p ${where}`, params);
    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("[PRODUCTS]", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/api/products/:slug", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, v.nom_boutique, v.logo AS vendeur_logo, v.note_moyenne, v.id AS vendeur_id
       FROM produits p JOIN vendeurs v ON v.id = p.vendeur_id
       WHERE (p.slug = ? OR p.id = ?) AND p.statut = 'actif'`,
      [req.params.slug, req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: "Produit non trouvé" });
    res.json({ product: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ════════════════════════════════════════════════════════
   COMMANDES
════════════════════════════════════════════════════════ */
app.post("/api/orders", authenticate,
  [
    body("items").isArray({ min:1 }).withMessage("Panier vide"),
    body("items.*.product_id").isInt({ min:1 }),
    body("items.*.qty").isInt({ min:1, max:100 }),
    body("adresse_livraison").trim().notEmpty().isLength({ max:500 }),
    body("mode_paiement").isIn(["orange_money","mtn_money","wave","moov_money","carte","livraison"]),
  ],
  validate,
  async (req, res) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const { items, adresse_livraison, mode_paiement, code_promo } = req.body;

      let total       = 0;
      let remise      = 0;
      const orderItems = [];

      // Vérifier stock et calculer total
      for (const item of items) {
        const [[prod]] = await conn.query(
          "SELECT id, nom, prix, stock, categorie FROM produits WHERE id = ? AND statut = 'actif'",
          [item.product_id]
        );
        if (!prod) throw new Error(`Produit ${item.product_id} non trouvé`);
        if (prod.stock < item.qty) throw new Error(`Stock insuffisant pour ${prod.nom}`);
        total += prod.prix * item.qty;
        orderItems.push({ ...prod, qty: item.qty });
      }

      // Appliquer code promo
      if (code_promo) {
        const [[promo]] = await conn.query(
          `SELECT * FROM codes_promo WHERE code = ? AND (user_id IS NULL OR user_id = ?)
           AND expires_at > NOW() AND utilisations < max_utilisations`,
          [code_promo, req.user.id]
        );
        if (promo) {
          remise = promo.type === "pourcentage" ? Math.round(total * promo.valeur / 100) : promo.valeur;
          await conn.query("UPDATE codes_promo SET utilisations = utilisations + 1 WHERE id = ?", [promo.id]);
        }
      }

      const totalFinal = Math.max(0, total - remise);
      const ref        = "MCP-" + Date.now() + "-" + Math.random().toString(36).substr(2,4).toUpperCase();
      const commission = Math.round(totalFinal * (COMMISSIONS.default));

      // Créer la commande
      const [orderResult] = await conn.query(
        `INSERT INTO orders (ref, user_id, total, remise, commission_mcp, mode_paiement, adresse_livraison, statut, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'en_attente', NOW())`,
        [ref, req.user.id, totalFinal, remise, commission, mode_paiement, adresse_livraison]
      );
      const orderId = orderResult.insertId;

      // Ajouter les lignes de commande et décrémenter le stock
      for (const item of orderItems) {
        await conn.query(
          "INSERT INTO order_items (order_id, product_id, qty, prix_unitaire) VALUES (?, ?, ?, ?)",
          [orderId, item.id, item.qty, item.prix]
        );
        await conn.query("UPDATE produits SET stock = stock - ? WHERE id = ?", [item.qty, item.id]);
      }

      await conn.commit();

      // Créditer les points de fidélité
      const points = Math.floor(totalFinal / 100);
      if (points > 0) {
        await pool.query(
          "INSERT INTO points_fidelite (user_id, type, points, description, ref_id, created_at) VALUES (?, 'credit', ?, 'Achat', ?, NOW())",
          [req.user.id, points, orderId]
        );
      }

      res.status(201).json({ success: true, ref, order_id: orderId, total: totalFinal, remise, points_gagnes: points });
    } catch (err) {
      await conn.rollback();
      console.error("[ORDER]", err.message);
      res.status(400).json({ error: err.message || "Erreur création commande" });
    } finally {
      conn.release();
    }
  }
);

app.get("/api/orders/my", authenticate, async (req, res) => {
  try {
    const [orders] = await pool.query(
      "SELECT id, ref, total, statut, mode_paiement, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [req.user.id]
    );
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/api/orders/:ref", authenticate, async (req, res) => {
  try {
    const [[order]] = await pool.query(
      "SELECT * FROM orders WHERE ref = ? AND user_id = ?",
      [req.params.ref, req.user.id]
    );
    if (!order) return res.status(404).json({ error: "Commande non trouvée" });
    const [items] = await pool.query(
      "SELECT oi.*, p.nom, p.images FROM order_items oi JOIN produits p ON p.id = oi.product_id WHERE oi.order_id = ?",
      [order.id]
    );
    res.json({ order: { ...order, items } });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* ════════════════════════════════════════════════════════
   ESPACE VENDEUR
════════════════════════════════════════════════════════ */
app.get("/api/vendor/dashboard", authenticate, requireRole("vendeur"), async (req, res) => {
  try {
    const [[vendeur]] = await pool.query("SELECT id FROM vendeurs WHERE user_id = ?", [req.user.id]);
    if (!vendeur) return res.status(404).json({ error: "Boutique non trouvée" });
    const vid = vendeur.id;

    const [[ revenu ]]   = await pool.query("SELECT COALESCE(SUM(oi.qty * oi.prix_unitaire), 0) AS total FROM order_items oi JOIN produits p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id WHERE p.vendeur_id = ? AND o.statut != 'annulee'", [vid]);
    const [[ commandes ]]= await pool.query("SELECT COUNT(DISTINCT o.id) AS total FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN produits p ON p.id = oi.product_id WHERE p.vendeur_id = ?", [vid]);
    const [[ produits ]] = await pool.query("SELECT COUNT(*) AS total FROM produits WHERE vendeur_id = ? AND statut = 'actif'", [vid]);
    const [[ abonnes  ]] = await pool.query("SELECT COUNT(*) AS total FROM follows WHERE vendeur_id = ?", [vid]);

    res.json({ revenu_total: revenu.total, total_commandes: commandes.total, total_produits: produits.total, total_abonnes: abonnes.total });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/api/vendor/products", authenticate, requireRole("vendeur"), async (req, res) => {
  try {
    const [[v]] = await pool.query("SELECT id FROM vendeurs WHERE user_id = ?", [req.user.id]);
    const [products] = await pool.query("SELECT * FROM produits WHERE vendeur_id = ? ORDER BY created_at DESC", [v.id]);
    res.json({ products });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.post("/api/vendor/products", authenticate, requireRole("vendeur"),
  [
    body("nom").trim().notEmpty().isLength({ max:200 }).escape(),
    body("prix").isFloat({ min:0 }),
    body("stock").isInt({ min:0 }),
    body("categorie").notEmpty().isIn(["electronique","mode","beaute","alimentation","maison","auto","services","autres"]),
  ],
  validate,
  async (req, res) => {
    try {
      const [[v]] = await pool.query("SELECT id FROM vendeurs WHERE user_id = ?", [req.user.id]);
      const { nom, description, prix, stock, categorie, images } = req.body;
      const slug = nom.toLowerCase().replace(/[^a-z0-9]+/g,"-") + "-" + Date.now();
      const [result] = await pool.query(
        "INSERT INTO produits (vendeur_id, nom, slug, description, prix, stock, categorie, images, statut, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'actif', NOW())",
        [v.id, nom, slug, sanitize(description||""), prix, stock, categorie, JSON.stringify(images||[])]
      );
      res.status(201).json({ success:true, product_id: result.insertId });
    } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
  }
);

app.put("/api/vendor/products/:id", authenticate, requireRole("vendeur"), async (req, res) => {
  try {
    const [[v]] = await pool.query("SELECT id FROM vendeurs WHERE user_id = ?", [req.user.id]);
    const [[p]] = await pool.query("SELECT id FROM produits WHERE id = ? AND vendeur_id = ?", [req.params.id, v.id]);
    if (!p) return res.status(403).json({ error: "Produit non trouvé ou accès refusé" });
    const { nom, description, prix, stock, statut } = req.body;
    await pool.query(
      "UPDATE produits SET nom=?, description=?, prix=?, stock=?, statut=?, updated_at=NOW() WHERE id=?",
      [sanitize(nom), sanitize(description||""), prix, stock, statut, req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.delete("/api/vendor/products/:id", authenticate, requireRole("vendeur"), async (req, res) => {
  try {
    const [[v]] = await pool.query("SELECT id FROM vendeurs WHERE user_id = ?", [req.user.id]);
    await pool.query("UPDATE produits SET statut='inactif' WHERE id = ? AND vendeur_id = ?", [req.params.id, v.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.get("/api/vendor/orders", authenticate, requireRole("vendeur"), async (req, res) => {
  try {
    const [[v]] = await pool.query("SELECT id FROM vendeurs WHERE user_id = ?", [req.user.id]);
    const [orders] = await pool.query(
      `SELECT o.ref, o.statut, o.created_at, o.total, u.prenom, u.nom
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN produits p ON p.id = oi.product_id
       JOIN users u ON u.id = o.user_id
       WHERE p.vendeur_id = ?
       GROUP BY o.id ORDER BY o.created_at DESC LIMIT 100`,
      [v.id]
    );
    res.json({ orders });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.put("/api/vendor/orders/:id/status", authenticate, requireRole("vendeur"),
  [body("statut").isIn(["confirmee","expediee","livree","annulee"])],
  validate,
  async (req, res) => {
    try {
      await pool.query("UPDATE orders SET statut = ?, updated_at = NOW() WHERE id = ?", [req.body.statut, req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
  }
);

/* ════════════════════════════════════════════════════════
   WEBHOOK CINETPAY — VÉRIFICATION SIGNATURE
════════════════════════════════════════════════════════ */
app.post("/api/webhooks/cinetpay", async (req, res) => {
  try {
    const { cpm_trans_id, cpm_site_id, cpm_amount, cpm_currency, signature } = req.body;

    // Vérifier la signature CinetPay
    const expectedSig = crypto.createHash("sha256")
      .update(cpm_site_id + cpm_trans_id + cpm_amount + cpm_currency + process.env.CINETPAY_SECRET)
      .digest("hex");

    if (signature !== expectedSig) {
      console.warn("[WEBHOOK] Signature invalide — tentative de fraude ?");
      return res.status(400).json({ error: "Signature invalide" });
    }

    // Marquer la commande comme payée
    await pool.query(
      "UPDATE orders SET statut = 'payee', payment_ref = ?, paid_at = NOW() WHERE ref = ?",
      [cpm_trans_id, cpm_trans_id]
    );

    // Activer le parrainage si 1ère commande
    const [[order]] = await pool.query("SELECT user_id FROM orders WHERE ref = ?", [cpm_trans_id]);
    if (order) {
      const [[ref]] = await pool.query(
        "SELECT id FROM referrals WHERE filleul_id = ? AND statut = 'en_attente'",
        [order.user_id]
      );
      if (ref) {
        await pool.query("UPDATE referrals SET statut='actif', activated_at=NOW() WHERE id=?", [ref.id]);
      }
    }

    res.json({ message: "OK" });
  } catch (err) {
    console.error("[WEBHOOK]", err.message);
    res.status(500).json({ error: "Erreur traitement webhook" });
  }
});

/* ════════════════════════════════════════════════════════
   AVIS
════════════════════════════════════════════════════════ */
app.post("/api/reviews", authenticate,
  [
    body("product_id").isInt({ min:1 }),
    body("note").isInt({ min:1, max:5 }),
    body("commentaire").trim().optional().isLength({ max:1000 }).escape(),
  ],
  validate,
  async (req, res) => {
    try {
      const { product_id, note, commentaire } = req.body;
      const [[existing]] = await pool.query(
        "SELECT id FROM reviews WHERE user_id = ? AND product_id = ?",
        [req.user.id, product_id]
      );
      if (existing) return res.status(409).json({ error: "Vous avez déjà noté ce produit" });
      await pool.query(
        "INSERT INTO reviews (user_id, product_id, note, commentaire, created_at) VALUES (?, ?, ?, ?, NOW())",
        [req.user.id, product_id, note, commentaire||""]
      );
      await pool.query(
        "INSERT INTO points_fidelite (user_id, type, points, description, created_at) VALUES (?, 'credit', 50, 'Avis laissé', NOW())",
        [req.user.id]
      );
      res.status(201).json({ success: true, points_gagnes: 50 });
    } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
  }
);

/* ════════════════════════════════════════════════════════
   WISHLIST
════════════════════════════════════════════════════════ */
app.post("/api/wishlist/toggle", authenticate, async (req, res) => {
  try {
    const { product_id } = req.body;
    const [[existing]] = await pool.query(
      "SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?",
      [req.user.id, product_id]
    );
    if (existing) {
      await pool.query("DELETE FROM wishlist WHERE id = ?", [existing.id]);
      return res.json({ action: "removed" });
    }
    await pool.query(
      "INSERT INTO wishlist (user_id, product_id, created_at) VALUES (?, ?, NOW())",
      [req.user.id, product_id]
    );
    res.json({ action: "added" });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.get("/api/wishlist", authenticate, async (req, res) => {
  try {
    const [items] = await pool.query(
      "SELECT p.id, p.nom, p.prix, p.images FROM wishlist w JOIN produits p ON p.id = w.product_id WHERE w.user_id = ?",
      [req.user.id]
    );
    res.json({ items });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

/* ════════════════════════════════════════════════════════
   CATÉGORIES
════════════════════════════════════════════════════════ */
app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT categorie, COUNT(*) AS total FROM produits WHERE statut='actif' GROUP BY categorie ORDER BY total DESC"
    );
    res.json({ categories: rows });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

/* ════════════════════════════════════════════════════════
   ABONNEMENTS VENDEURS
════════════════════════════════════════════════════════ */
app.post("/api/vendeurs/:id/follow", authenticate, async (req, res) => {
  try {
    const [[existing]] = await pool.query(
      "SELECT id FROM follows WHERE acheteur_id = ? AND vendeur_id = ?",
      [req.user.id, req.params.id]
    );
    if (existing) return res.json({ success: true, already: true });
    await pool.query(
      "INSERT INTO follows (acheteur_id, vendeur_id, created_at) VALUES (?, ?, NOW())",
      [req.user.id, req.params.id]
    );
    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM follows WHERE vendeur_id = ?", [req.params.id]);
    res.json({ success: true, followers: total });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.delete("/api/vendeurs/:id/follow", authenticate, async (req, res) => {
  try {
    await pool.query("DELETE FROM follows WHERE acheteur_id = ? AND vendeur_id = ?", [req.user.id, req.params.id]);
    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM follows WHERE vendeur_id = ?", [req.params.id]);
    res.json({ success: true, followers: total });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.get("/api/vendeurs/:id/followers", async (req, res) => {
  try {
    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM follows WHERE vendeur_id = ?", [req.params.id]);
    res.json({ followers: total });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.get("/api/vendeurs/:id/follow-status", authenticate, async (req, res) => {
  try {
    const [[row]] = await pool.query(
      "SELECT id FROM follows WHERE acheteur_id = ? AND vendeur_id = ?",
      [req.user.id, req.params.id]
    );
    res.json({ following: !!row });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

/* ════════════════════════════════════════════════════════
   CADEAUX VIRTUELS LIVE
════════════════════════════════════════════════════════ */
app.get("/api/gifts", (req, res) => {
  const list = Object.entries(GIFTS).map(([id, g]) => ({
    id, name: g.name, price_fcfa: g.price_fcfa,
    vendor_cut_pct: Math.round((1 - g.mcp_cut) * 100),
  }));
  res.json({ gifts: list });
});

app.post("/api/live/:liveId/gift", authenticate, async (req, res) => {
  try {
    const { gift_type, quantity = 1 } = req.body;
    const gift = GIFTS[gift_type];
    if (!gift) return res.status(400).json({ error: "Cadeau invalide" });
    const total       = gift.price_fcfa * quantity;
    const mcpShare    = Math.round(total * gift.mcp_cut);
    const vendorShare = total - mcpShare;
    await pool.query(
      "INSERT INTO live_gifts (live_id, acheteur_id, gift_type, quantity, total_fcfa, mcp_share, vendor_share, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
      [req.params.liveId, req.user.id, gift_type, quantity, total, mcpShare, vendorShare]
    );
    res.json({ success: true, gift: gift.name, total_fcfa: total, vendor_receives: vendorShare });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

/* ════════════════════════════════════════════════════════
   FIDÉLITÉ
════════════════════════════════════════════════════════ */
app.get("/api/fidelite/points", authenticate, async (req, res) => {
  try {
    const [[row]] = await pool.query(
      "SELECT SUM(CASE WHEN type='credit' THEN points ELSE -points END) AS total FROM points_fidelite WHERE user_id = ?",
      [req.user.id]
    );
    const total  = Math.max(0, row.total || 0);
    const niveau = getNiveau(total);
    res.json({ points: total, niveau: niveau.nom, bonus_pct: niveau.bonus_pct });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.post("/api/fidelite/redeem", authenticate, async (req, res) => {
  try {
    const { points } = req.body;
    if (!points || points < 100) return res.status(400).json({ error: "Minimum 100 points" });
    const [[{ total }]] = await pool.query(
      "SELECT COALESCE(SUM(CASE WHEN type='credit' THEN points ELSE -points END),0) AS total FROM points_fidelite WHERE user_id = ?",
      [req.user.id]
    );
    if (points > total) return res.status(400).json({ error: "Solde insuffisant" });
    const code    = "FID-" + points + "-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await pool.query(
      "INSERT INTO points_fidelite (user_id, type, points, description, created_at) VALUES (?, 'debit', ?, ?, NOW())",
      [req.user.id, points, "Utilisation points — " + code]
    );
    await pool.query(
      "INSERT INTO codes_promo (code, type, valeur, user_id, expires_at, max_utilisations, created_at) VALUES (?, 'montant_fixe', ?, ?, ?, 1, NOW())",
      [code, points, req.user.id, expires]
    );
    res.json({ success: true, code, valeur_fcfa: points, expires_at: expires });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

/* ════════════════════════════════════════════════════════
   PARRAINAGE
════════════════════════════════════════════════════════ */
app.get("/api/parrainage/code", authenticate, async (req, res) => {
  try {
    let [[row]] = await pool.query("SELECT code FROM referral_codes WHERE user_id = ?", [req.user.id]);
    if (!row) {
      const [[user]] = await pool.query("SELECT prenom FROM users WHERE id = ?", [req.user.id]);
      const code = "MCP-" + (user.prenom||"USER").toUpperCase().replace(/[^A-Z]/g,"").substr(0,6) + "-" + crypto.randomBytes(2).toString("hex").toUpperCase();
      await pool.query("INSERT INTO referral_codes (user_id, code, created_at) VALUES (?, ?, NOW())", [req.user.id, code]);
      row = { code };
    }
    res.json({ code: row.code });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.get("/api/parrainage/stats", authenticate, async (req, res) => {
  try {
    const [[stats]] = await pool.query(
      "SELECT COUNT(*) AS total_invites, SUM(statut='actif') AS total_actifs, COALESCE(SUM(gains_fcfa),0) AS total_gains FROM referrals WHERE parrain_id = ?",
      [req.user.id]
    );
    res.json({ stats });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.post("/api/parrainage/appliquer", async (req, res) => {
  try {
    const { code, filleul_id } = req.body;
    const [[ref]] = await pool.query(
      "SELECT user_id AS parrain_id FROM referral_codes WHERE code = ? AND user_id != ?",
      [code, filleul_id]
    );
    if (!ref) return res.status(400).json({ error: "Code invalide" });
    await pool.query(
      "INSERT IGNORE INTO referrals (parrain_id, filleul_id, code, statut, gains_fcfa, created_at) VALUES (?, ?, ?, 'en_attente', 0, NOW())",
      [ref.parrain_id, filleul_id, code]
    );
    const promoCode = "BIENVENUE-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    await pool.query(
      "INSERT INTO codes_promo (code, type, valeur, user_id, expires_at, max_utilisations, created_at) VALUES (?, 'montant_fixe', 1000, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), 1, NOW())",
      [promoCode, filleul_id]
    );
    res.json({ success: true, promo_code: promoCode, message: "1 000 FCFA de réduction sur votre 1ère commande !" });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

/* ════════════════════════════════════════════════════════
   ADMIN
════════════════════════════════════════════════════════ */
app.get("/api/admin/stats", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const [[users]]    = await pool.query("SELECT COUNT(*) AS total FROM users");
    const [[vendors]]  = await pool.query("SELECT COUNT(*) AS total FROM vendeurs WHERE statut='actif'");
    const [[orders]]   = await pool.query("SELECT COUNT(*) AS total, COALESCE(SUM(total),0) AS ca FROM orders WHERE statut != 'annulee'");
    const [[products]] = await pool.query("SELECT COUNT(*) AS total FROM produits WHERE statut='actif'");
    res.json({ users: users.total, vendors: vendors.total, orders: orders.total, ca: orders.ca, products: products.total });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

/* ════════════════════════════════════════════════════════
   NOTIFICATIONS
════════════════════════════════════════════════════════ */
app.get("/api/notifications", authenticate, async (req, res) => {
  try {
    const [notifs] = await pool.query(
      "SELECT id, type, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30",
      [req.user.id]
    );
    res.json({ notifications: notifs });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.put("/api/notifications/read-all", authenticate, async (req, res) => {
  try {
    await pool.query("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [req.user.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Erreur serveur" }); }
});

/* ════════════════════════════════════════════════════════
   GESTION GLOBALE DES ERREURS
════════════════════════════════════════════════════════ */

/* 404 */
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée — " + req.method + " " + req.path });
});

/* Erreurs globales */
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.stack);
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ error: err.message });
  }
  res.status(500).json({ error: "Erreur interne du serveur" });
});

/* ════════════════════════════════════════════════════════
   DÉMARRAGE
════════════════════════════════════════════════════════ */
app.listen(PORT, "127.0.0.1", () => {
  console.log("╔══════════════════════════════════════════════");
  console.log("║ Market Center Place API — Port " + PORT);
  console.log("║ Mode : " + (process.env.NODE_ENV || "development"));
  console.log("║ HTTPS : " + (process.env.NODE_ENV === "production" ? "✓ Via Nginx" : "✗ Dev seulement"));
  console.log("╚══════════════════════════════════════════════");
});

module.exports = app;
