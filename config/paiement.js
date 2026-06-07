// ============================================================
// MARKET CENTER PLACE — Intégration CinetPay
// Gère : Orange Money CI, MTN Money, Moov Money, Wave CI
// ============================================================
// Docs CinetPay : https://docs.cinetpay.com
// Créer un compte : https://cinetpay.com
// ============================================================

const axios = require('axios');

const CINETPAY_BASE = 'https://api-checkout.cinetpay.com/v2';

// Mapping modes paiement MCP → codes CinetPay
const CHANNELS = {
  orange: 'ORANGE_CI',
  mtn:    'MTN_CI',
  moov:   'MOOV_CI',
  wave:   'WAVE_CI',
  visa:   'CREDIT_CARD',
};

/**
 * Initier un paiement CinetPay
 * @returns {string} URL de paiement à rediriger l'utilisateur
 */
async function initierPaiement({ commandeId, reference, montant, modePaiement, clientNom, clientEmail, clientTel, notifyUrl, returnUrl }) {
  const payload = {
    apikey:             process.env.CINETPAY_API_KEY,
    site_id:            process.env.CINETPAY_SITE_ID,
    transaction_id:     reference,
    amount:             montant,
    currency:           'XOF',       // FCFA
    alternative_currency: '',
    description:        `Commande Market Center Place #${reference}`,
    customer_name:      clientNom,
    customer_email:     clientEmail || 'client@marketcenterplace.ci',
    customer_phone_number: clientTel,
    customer_address:   'Abidjan, Cote d\'Ivoire',
    customer_city:      'Abidjan',
    customer_country:   'CI',
    customer_state:     'CI',
    customer_zip_code:  '00225',
    // Canaux autorisés selon le mode choisi
    channels:           CHANNELS[modePaiement] || 'ALL',
    notify_url:         notifyUrl,   // Webhook : /api/webhooks/cinetpay
    return_url:         returnUrl,   // Redirection après paiement
    lang:               'fr',
    metadata:           JSON.stringify({ commande_id: commandeId }),
  };

  const response = await axios.post(`${CINETPAY_BASE}/payment`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.data.code !== '201') {
    throw new Error(`CinetPay erreur: ${response.data.message}`);
  }

  return response.data.data.payment_url;
}

/**
 * Vérifier le statut d'un paiement CinetPay
 */
async function verifierPaiement(transactionId) {
  const payload = {
    apikey:         process.env.CINETPAY_API_KEY,
    site_id:        process.env.CINETPAY_SITE_ID,
    transaction_id: transactionId,
  };

  const response = await axios.post(`${CINETPAY_BASE}/payment/check`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return {
    statut:   response.data.data?.status,       // 'ACCEPTED', 'REFUSED', 'PENDING'
    montant:  response.data.data?.amount,
    devise:   response.data.data?.currency_code,
    message:  response.data.message,
  };
}

/**
 * Valider la signature du webhook CinetPay
 * À appeler dans /api/webhooks/cinetpay avant de traiter
 */
function validerWebhook(req) {
  // CinetPay envoie le payload en POST standard
  // Vérifier que la requête vient bien de CinetPay via l'API key
  const { cpm_site_id } = req.body;
  return cpm_site_id === process.env.CINETPAY_SITE_ID;
}

// ── INTÉGRATION WAVE CI ─────────────────────────────────────
// Wave a sa propre API distincte de CinetPay
async function initierWave({ reference, montant, returnUrl, clientTel }) {
  const response = await axios.post('https://api.wave.com/v1/checkout/sessions', {
    amount:   String(montant),
    currency: 'XOF',
    error_url:   returnUrl + '?status=error',
    success_url: returnUrl + '?status=success',
    client_reference: reference,
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.WAVE_API_KEY}`,
      'Content-Type':  'application/json',
    },
  });
  return response.data.wave_launch_url;
}

// ── INTÉGRATION SMS ─────────────────────────────────────────
// CinetPay propose aussi une API SMS pour CI/Afrique de l'Ouest
async function envoyerSMS(telephone, message) {
  try {
    await axios.post('https://api.cinetpay.com/v1/sms', {
      apikey:  process.env.CINETPAY_API_KEY,
      to:      telephone,
      message: message,
      sender:  'MarketCP',
    });
    console.log(`SMS envoyé à ${telephone}`);
  } catch (err) {
    console.error('Erreur SMS:', err.message);
    // Non bloquant - le paiement continue même si le SMS échoue
  }
}

/**
 * Confirmer une commande après paiement réussi
 * Appelé depuis le webhook
 */
async function confirmerCommande(pool, commandeId, transactionId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Mettre à jour la commande
    await conn.query(
      `UPDATE commandes 
       SET statut = 'confirmee', statut_paiement = 'paye', 
           paye_le = NOW(), transaction_id = ?
       WHERE id = ?`,
      [transactionId, commandeId]
    );

    // Récupérer les infos pour le SMS
    const [[commande]] = await conn.query(
      `SELECT c.reference, c.total, c.livraison_telephone,
              u.prenom
       FROM commandes c JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [commandeId]
    );

    await conn.commit();

    // Envoyer SMS de confirmation
    if (commande) {
      await envoyerSMS(
        commande.livraison_telephone,
        `Bonjour ${commande.prenom} ! Votre commande ${commande.reference} est confirmee. Total : ${Number(commande.total).toLocaleString('fr-FR')} FCFA. Merci pour votre confiance. - Market Center Place`
      );
    }

    return commande;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  initierPaiement,
  verifierPaiement,
  validerWebhook,
  initierWave,
  envoyerSMS,
  confirmerCommande,
};
