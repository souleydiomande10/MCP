-- ============================================================
-- MARKET CENTER PLACE — Base de données MySQL complète
-- Version 1.0 — Côte d'Ivoire
-- ============================================================

CREATE DATABASE IF NOT EXISTS mcp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mcp_db;

-- ── USERS ──────────────────────────────────────────────────
CREATE TABLE users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  prenom        VARCHAR(80)  NOT NULL,
  nom           VARCHAR(80)  NOT NULL,
  email         VARCHAR(180) NOT NULL UNIQUE,
  telephone     VARCHAR(20)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('acheteur','vendeur','admin') NOT NULL DEFAULT 'acheteur',
  email_verifie TINYINT(1) DEFAULT 0,
  tel_verifie   TINYINT(1) DEFAULT 0,
  actif         TINYINT(1) DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── VENDEURS ───────────────────────────────────────────────
CREATE TABLE vendeurs (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id           BIGINT UNSIGNED NOT NULL UNIQUE,
  nom_boutique      VARCHAR(120) NOT NULL,
  slug              VARCHAR(130) NOT NULL UNIQUE,
  description       TEXT,
  categorie_id      INT UNSIGNED,
  ville             VARCHAR(80),
  commune           VARCHAR(80),
  adresse           TEXT,
  point_repere      VARCHAR(255),
  mode_paiement     ENUM('orange','mtn','moov','wave','bank') DEFAULT 'orange',
  numero_paiement   VARCHAR(30),
  statut            ENUM('en_attente','approuve','suspendu') DEFAULT 'en_attente',
  note_moyenne      DECIMAL(3,2) DEFAULT 0.00,
  total_ventes      INT UNSIGNED DEFAULT 0,
  taux_livraison    DECIMAL(5,2) DEFAULT 98.00,
  approuve_le       TIMESTAMP NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── CATEGORIES ─────────────────────────────────────────────
CREATE TABLE categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(80)  NOT NULL,
  slug        VARCHAR(90)  NOT NULL UNIQUE,
  description TEXT,
  icone_svg   TEXT,
  couleur     VARCHAR(7) DEFAULT '#0b1f4b',
  actif       TINYINT(1) DEFAULT 1,
  ordre       INT UNSIGNED DEFAULT 0
) ENGINE=InnoDB;

INSERT INTO categories (nom, slug, ordre) VALUES
('Electronique',       'electronique',    1),
('Mode & Wax',         'mode-wax',        2),
('Sante & Bien-etre',  'sante',           3),
('Maison & Deco',      'maison-deco',     4),
('Beaute & Soins',     'beaute-soins',    5),
('Artisanat local',    'artisanat',       6),
('Alimentation',       'alimentation',    7),
('Agriculture',        'agriculture',     8),
('High-Tech',          'high-tech',       9),
('Sport & Loisirs',    'sport',           10),
('Livres & Bureau',    'livres',          11),
('Bricolage',          'bricolage',       12),
('Auto & Moto',        'auto-moto',       13);

-- ── PRODUITS ───────────────────────────────────────────────
CREATE TABLE produits (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vendeur_id      BIGINT UNSIGNED NOT NULL,
  categorie_id    INT UNSIGNED NOT NULL,
  nom             VARCHAR(200) NOT NULL,
  slug            VARCHAR(220) NOT NULL UNIQUE,
  description     TEXT,
  description_courte VARCHAR(300),
  prix            DECIMAL(12,0) NOT NULL,
  prix_barre      DECIMAL(12,0) NULL,
  sku             VARCHAR(80) UNIQUE,
  stock           INT UNSIGNED DEFAULT 0,
  stock_alerte    INT UNSIGNED DEFAULT 5,
  poids_kg        DECIMAL(8,3) DEFAULT 0,
  actif           TINYINT(1) DEFAULT 1,
  featured        TINYINT(1) DEFAULT 0,
  note_moyenne    DECIMAL(3,2) DEFAULT 0.00,
  nb_avis         INT UNSIGNED DEFAULT 0,
  nb_ventes       INT UNSIGNED DEFAULT 0,
  nb_vues         INT UNSIGNED DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vendeur_id)   REFERENCES vendeurs(id)   ON DELETE CASCADE,
  FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_categorie (categorie_id),
  INDEX idx_vendeur   (vendeur_id),
  INDEX idx_actif_stock (actif, stock),
  FULLTEXT INDEX idx_search (nom, description_courte)
) ENGINE=InnoDB;

-- ── IMAGES PRODUITS ────────────────────────────────────────
CREATE TABLE produit_images (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  produit_id  BIGINT UNSIGNED NOT NULL,
  url         VARCHAR(500) NOT NULL,
  alt         VARCHAR(200),
  principale  TINYINT(1) DEFAULT 0,
  ordre       INT UNSIGNED DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── VARIANTES PRODUITS (taille, couleur…) ──────────────────
CREATE TABLE produit_variantes (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  produit_id  BIGINT UNSIGNED NOT NULL,
  type        VARCHAR(50) NOT NULL,  -- 'couleur', 'taille', 'stockage'
  valeur      VARCHAR(80) NOT NULL,
  prix_extra  DECIMAL(10,0) DEFAULT 0,
  stock       INT UNSIGNED DEFAULT 0,
  actif       TINYINT(1) DEFAULT 1,
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── COMMANDES ──────────────────────────────────────────────
CREATE TABLE commandes (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference           VARCHAR(30) NOT NULL UNIQUE,  -- MCP-2025-00847
  user_id             BIGINT UNSIGNED NOT NULL,
  statut              ENUM('en_attente','confirmee','en_preparation','en_livraison','livree','annulee','remboursee')
                      NOT NULL DEFAULT 'en_attente',
  -- Livraison
  livraison_prenom    VARCHAR(80),
  livraison_nom       VARCHAR(80),
  livraison_telephone VARCHAR(20),
  livraison_adresse   TEXT,
  livraison_ville     VARCHAR(80),
  livraison_commune   VARCHAR(80),
  livraison_type      ENUM('standard','express') DEFAULT 'standard',
  frais_livraison     DECIMAL(10,0) DEFAULT 0,
  -- Paiement
  mode_paiement       ENUM('orange','mtn','moov','wave','visa','livraison') NOT NULL,
  statut_paiement     ENUM('en_attente','paye','echoue','rembourse') DEFAULT 'en_attente',
  transaction_id      VARCHAR(100),  -- ID retourné par CinetPay/Wave
  -- Montants
  sous_total          DECIMAL(12,0) NOT NULL,
  code_promo          VARCHAR(30),
  reduction           DECIMAL(10,0) DEFAULT 0,
  total               DECIMAL(12,0) NOT NULL,
  -- Dates
  paye_le             TIMESTAMP NULL,
  livre_le            TIMESTAMP NULL,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_user    (user_id),
  INDEX idx_statut  (statut),
  INDEX idx_paiement_statut (statut_paiement)
) ENGINE=InnoDB;

-- ── ARTICLES COMMANDE ──────────────────────────────────────
CREATE TABLE commande_items (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  commande_id     BIGINT UNSIGNED NOT NULL,
  produit_id      BIGINT UNSIGNED NOT NULL,
  vendeur_id      BIGINT UNSIGNED NOT NULL,
  nom_produit     VARCHAR(200) NOT NULL,  -- snapshot au moment de l'achat
  prix_unitaire   DECIMAL(12,0) NOT NULL,
  quantite        INT UNSIGNED NOT NULL DEFAULT 1,
  variante        VARCHAR(100),
  sous_total      DECIMAL(12,0) NOT NULL,
  statut_vendeur  ENUM('nouveau','en_preparation','expedie','livre') DEFAULT 'nouveau',
  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
  FOREIGN KEY (vendeur_id)  REFERENCES vendeurs(id)  ON DELETE RESTRICT,
  INDEX idx_commande (commande_id),
  INDEX idx_vendeur  (vendeur_id)
) ENGINE=InnoDB;

-- ── AVIS CLIENTS ───────────────────────────────────────────
CREATE TABLE avis (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  produit_id      BIGINT UNSIGNED NOT NULL,
  user_id         BIGINT UNSIGNED NOT NULL,
  commande_id     BIGINT UNSIGNED,
  note            TINYINT UNSIGNED NOT NULL CHECK (note BETWEEN 1 AND 5),
  titre           VARCHAR(120),
  commentaire     TEXT,
  verifie         TINYINT(1) DEFAULT 0,  -- achat vérifié
  visible         TINYINT(1) DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_avis (produit_id, user_id),
  FOREIGN KEY (produit_id)  REFERENCES produits(id)  ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── FAVORIS ────────────────────────────────────────────────
CREATE TABLE favoris (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  produit_id  BIGINT UNSIGNED NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favori (user_id, produit_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── CODES PROMO ────────────────────────────────────────────
CREATE TABLE codes_promo (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(30) NOT NULL UNIQUE,
  type            ENUM('pourcentage','montant_fixe') NOT NULL,
  valeur          DECIMAL(10,2) NOT NULL,
  montant_minimum DECIMAL(10,0) DEFAULT 0,
  utilisations_max INT UNSIGNED DEFAULT 1,
  utilisations    INT UNSIGNED DEFAULT 0,
  actif           TINYINT(1) DEFAULT 1,
  expire_le       DATE NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO codes_promo (code, type, valeur, montant_minimum, utilisations_max) VALUES
('BIENVENUE10', 'pourcentage', 10, 20000, 500),
('MCP2025',     'montant_fixe', 5000, 50000, 100),
('SANTE15',     'pourcentage', 15, 10000, 200);

-- ── TOKENS AUTH ────────────────────────────────────────────
CREATE TABLE auth_tokens (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  token       VARCHAR(255) NOT NULL UNIQUE,
  type        ENUM('access','refresh','email_verify','reset_pwd') NOT NULL,
  expire_le   TIMESTAMP NOT NULL,
  utilise     TINYINT(1) DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_type (user_id, type)
) ENGINE=InnoDB;


-- ── COMPTES SOCIAUX (OAuth Google/Facebook/Apple/WhatsApp) ──
CREATE TABLE social_accounts (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  provider   ENUM('google','facebook','apple','whatsapp') NOT NULL,
  social_id  VARCHAR(200) NOT NULL,
  avatar     VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_social (provider, social_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── NOTIFICATIONS ──────────────────────────────────────────
CREATE TABLE notifications (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  type        VARCHAR(60) NOT NULL,  -- 'commande_confirmee', 'livraison', etc.
  titre       VARCHAR(120),
  message     TEXT,
  data        JSON,
  lue         TINYINT(1) DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_lue (user_id, lue)
) ENGINE=InnoDB;

-- ── PAIEMENTS LOGS ─────────────────────────────────────────
CREATE TABLE paiements_logs (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  commande_id     BIGINT UNSIGNED NOT NULL,
  provider        ENUM('cinetpay','wave','stripe') NOT NULL,
  transaction_id  VARCHAR(120),
  montant         DECIMAL(12,0),
  statut          ENUM('initie','succes','echec','rembourse') DEFAULT 'initie',
  payload_request JSON,
  payload_response JSON,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── VUES ───────────────────────────────────────────────────

-- Vue catalogue publique
CREATE VIEW vue_produits_actifs AS
SELECT
  p.id, p.nom, p.slug, p.prix, p.prix_barre, p.stock,
  p.note_moyenne, p.nb_avis, p.nb_ventes, p.featured,
  p.description_courte,
  c.nom AS categorie, c.slug AS categorie_slug,
  v.nom_boutique AS vendeur, v.slug AS vendeur_slug,
  v.note_moyenne AS vendeur_note,
  (SELECT url FROM produit_images pi WHERE pi.produit_id = p.id AND pi.principale = 1 LIMIT 1) AS image_principale
FROM produits p
JOIN categories c ON p.categorie_id = c.id
JOIN vendeurs   v ON p.vendeur_id = v.id
WHERE p.actif = 1 AND v.statut = 'approuve';

-- Vue stats vendeur
CREATE VIEW vue_stats_vendeur AS
SELECT
  v.id AS vendeur_id,
  v.nom_boutique,
  COUNT(DISTINCT ci.commande_id) AS total_commandes_mois,
  SUM(ci.sous_total) AS ca_mois,
  COUNT(DISTINCT p.id) AS nb_produits_actifs,
  v.note_moyenne
FROM vendeurs v
LEFT JOIN commande_items ci ON ci.vendeur_id = v.id
LEFT JOIN produits p ON p.vendeur_id = v.id AND p.actif = 1
WHERE MONTH(ci.created_at) = MONTH(NOW())
GROUP BY v.id;


/* ────────────────────────────────────────────
   TABLE : ABONNEMENTS (follows)
──────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS follows (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  acheteur_id  INT UNSIGNED NOT NULL,
  vendeur_id   INT UNSIGNED NOT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_follow (acheteur_id, vendeur_id),
  KEY idx_vendeur  (vendeur_id),
  KEY idx_acheteur (acheteur_id),

  FOREIGN KEY (acheteur_id) REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (vendeur_id)  REFERENCES vendeurs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ────────────────────────────────────────────
   TABLE : CADEAUX VIRTUELS LIVE
──────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS live_gifts (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  live_id       INT UNSIGNED  NOT NULL,
  acheteur_id   INT UNSIGNED  NOT NULL,
  gift_type     VARCHAR(30)   NOT NULL,
  quantity      TINYINT       NOT NULL DEFAULT 1,
  total_fcfa    INT           NOT NULL,
  mcp_share     INT           NOT NULL COMMENT 'Part MCP en FCFA',
  vendor_share  INT           NOT NULL COMMENT 'Part vendeur en FCFA',
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_live    (live_id),
  KEY idx_acheteur (acheteur_id),

  FOREIGN KEY (acheteur_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ────────────────────────────────────────────
   TABLE : NOTIFICATIONS
──────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  type       VARCHAR(50)  NOT NULL COMMENT 'follow | live_start | new_product | promo | order | gift',
  message    TEXT         NOT NULL,
  ref_id     INT UNSIGNED NULL     COMMENT 'ID vendeur ou commande selon le type',
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_user   (user_id),
  KEY idx_unread (user_id, is_read),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ────────────────────────────────────────────
   TABLE : SESSIONS LIVE
──────────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS live_sessions (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vendeur_id      INT UNSIGNED  NOT NULL,
  titre           VARCHAR(200)  NOT NULL,
  statut          ENUM('actif','termine','planifie') DEFAULT 'actif',
  viewers_peak    INT           NOT NULL DEFAULT 0,
  total_commandes INT           NOT NULL DEFAULT 0,
  ca_genere       INT           NOT NULL DEFAULT 0  COMMENT 'CA en FCFA',
  demarrage       DATETIME      NULL,
  fin             DATETIME      NULL,
  replay_url      VARCHAR(500)  NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_vendeur (vendeur_id),
  KEY idx_statut  (statut),

  FOREIGN KEY (vendeur_id) REFERENCES vendeurs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ────────────────────────────────────────────
   VUES UTILES
──────────────────────────────────────────── */

/* Classement vendeurs par abonnés */
CREATE OR REPLACE VIEW view_top_vendeurs AS
SELECT
  v.id, v.nom_boutique, v.logo, v.note_moyenne,
  COUNT(f.id) AS total_abonnes,
  v.total_ventes
FROM vendeurs v
LEFT JOIN follows f ON f.vendeur_id = v.id
GROUP BY v.id
ORDER BY total_abonnes DESC;

/* Revenus cadeaux par vendeur */
CREATE OR REPLACE VIEW view_vendor_gifts_revenue AS
SELECT
  ls.vendeur_id,
  SUM(lg.vendor_share) AS total_revenus_fcfa,
  COUNT(lg.id)         AS total_cadeaux,
  SUM(lg.quantity)     AS total_envoyes
FROM live_gifts lg
JOIN live_sessions ls ON ls.id = lg.live_id
GROUP BY ls.vendeur_id;


/* ────────────────────────────────────────
   POINTS FIDÉLITÉ
──────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS points_fidelite (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  type        ENUM('credit','debit') NOT NULL,
  points      INT UNSIGNED NOT NULL,
  description VARCHAR(200) NOT NULL,
  ref_id      INT UNSIGNED NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ────────────────────────────────────────
   CODES DE PARRAINAGE
──────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS referral_codes (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL UNIQUE,
  code       VARCHAR(30)  NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_code (code),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ────────────────────────────────────────
   RELATIONS DE PARRAINAGE
──────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS referrals (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parrain_id   INT UNSIGNED NOT NULL,
  filleul_id   INT UNSIGNED NOT NULL UNIQUE,
  code         VARCHAR(30)  NOT NULL,
  statut       ENUM('en_attente','actif','expire') DEFAULT 'en_attente',
  gains_fcfa   INT NOT NULL DEFAULT 0,
  activated_at DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_parrain (parrain_id),
  FOREIGN KEY (parrain_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (filleul_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ────────────────────────────────────────
   INVITATIONS PAR EMAIL
──────────────────────────────────────── */
CREATE TABLE IF NOT EXISTS referral_invitations (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parrain_id  INT UNSIGNED NOT NULL,
  email_invite VARCHAR(200) NOT NULL,
  code        VARCHAR(30)  NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_invite (parrain_id, email_invite),
  FOREIGN KEY (parrain_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ────────────────────────────────────────
   VUES FIDÉLITÉ ET PARRAINAGE
──────────────────────────────────────── */
CREATE OR REPLACE VIEW view_user_points AS
SELECT
  user_id,
  SUM(CASE WHEN type='credit' THEN points ELSE -points END) AS solde_points
FROM points_fidelite
GROUP BY user_id;

CREATE OR REPLACE VIEW view_top_parrains AS
SELECT
  u.id, u.prenom, u.nom,
  COUNT(r.id)      AS total_filleuls,
  SUM(r.gains_fcfa) AS total_gains_fcfa
FROM referrals r
JOIN users u ON u.id = r.parrain_id
WHERE r.statut = 'actif'
GROUP BY u.id
ORDER BY total_gains_fcfa DESC;
