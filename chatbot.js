/* ============================================================
   MARKET CENTER PLACE — Aya Chatbot v2.0 Pro
   Assistant virtuel intelligent avec animations premium
   Usage : <script src="chatbot.js"></script>
   ============================================================ */

(function() {
'use strict';

/* ════════════════════════════════════════════════
   CONFIGURATION
   ════════════════════════════════════════════════ */
const CFG = {
  name:         'Aya',
  role:         'Assistante Market Center Place',
  typingDelay:  700,
  typingMin:    800,
  typingMax:    1400,
  proactiveMs:  9000,
  inactiveMs:   50000,
  maxMsgs:      60,
};

/* ════════════════════════════════════════════════
   BASE DE CONNAISSANCES ENRICHIE
   ════════════════════════════════════════════════ */
const KB = {

  greet: {
    triggers: ['bonjour','bonsoir','salut','hello','hi','bjr','bj','slt','coucou','yo'],
    answers: [
      "Bonjour ! Je suis **Aya**, votre assistante Market Center Place. Comment puis-je vous aider aujourd'hui ?\n\nJe peux vous aider avec vos commandes, les paiements, les produits, ou devenir vendeur.",
      "Bonsoir et bienvenue sur MCP ! Ravi de vous accueillir. Que puis-je faire pour vous ?",
      "Salut ! Je suis là pour vous aider à trouver les meilleurs produits en Côte d'Ivoire. Quelle est votre question ?"
    ],
    quick: ['📦 Suivi commande', '💳 Paiements', '🏪 Vendre sur MCP', '🔍 Trouver un produit']
  },

  commande: {
    triggers: ['commande','commander','acheter','achat','livraison','livrer','délai','quand','reçu','suivre','suivi','colis','expédié','expédition','track'],
    answers: [
      "📦 **Comment passer une commande :**\n1. Trouvez votre produit dans le catalogue\n2. Cliquez **Ajouter au panier**\n3. Validez votre panier\n4. Choisissez l'adresse de livraison\n5. Payez par Mobile Money, Wave ou carte\n\nVous recevez une confirmation SMS immédiatement !",
      "🚚 **Délais de livraison :**\n• Abidjan express : **le jour même** (commande avant 14h)\n• Abidjan standard : **24 à 48h**\n• Bouaké, Yamoussoukro, San Pedro : **3 à 5 jours**\n• Autres villes CI : **5 à 7 jours**\n\nLivraison **gratuite** dès 15 000 FCFA à Abidjan !",
      "🔍 **Suivre votre commande :**\n1. Connectez-vous à votre compte\n2. Allez dans **Mon compte → Mes commandes**\n3. Cliquez sur votre commande\n\nVous verrez le statut en temps réel et le numéro de suivi du livreur."
    ],
    quick: ['🚚 Délais livraison', '📱 Suivre mon colis', '📞 Problème de livraison']
  },

  paiement: {
    triggers: ['paiement','payer','orange','mtn','wave','moov','visa','carte','mobile money','comment payer','payé','mode de paiement','remboursement','rembourser'],
    answers: [
      "💳 **Modes de paiement acceptés :**\n\n• 🟠 **Orange Money CI**\n• 🟡 **MTN Mobile Money**\n• 🔵 **Wave CI** (1% de commission seulement)\n• 🟣 **Moov Money**\n• 💳 **Visa / Mastercard**\n• 🏠 **Paiement à la livraison** (vendeurs certifiés)\n\nTous les paiements sont **100% sécurisés** via CinetPay.",
      "🔒 **Sécurité des paiements :**\nVotre argent est retenu en sécurité et versé au vendeur **uniquement après confirmation** de votre livraison.\n\nSi vous ne recevez pas votre commande, vous êtes **remboursé intégralement** sous 48h.",
      "💰 **Remboursement :**\n• Mobile Money : **sous 48h**\n• Carte bancaire : **3 à 5 jours ouvrables**\n\nInitiez le remboursement depuis **Mon compte → Mes commandes → Retourner**."
    ],
    quick: ['🔒 Sécurité paiements', '💰 Comment me faire rembourser', '🏠 Paiement livraison']
  },

  retour: {
    triggers: ['retour','retourner','remboursement','échange','cassé','défectueux','conforme','réclamation','problème commande','pas reçu','qualité','déçu'],
    answers: [
      "🔄 **Politique de retour MCP :**\n• **7 jours** pour retourner un produit\n• Produit non utilisé dans son emballage d'origine\n• **Retour gratuit** si produit défectueux ou non conforme\n\n**Comment faire :**\nMon compte → Mes commandes → [Commande] → Retourner",
      "😟 **Produit reçu endommagé ou incorrect ?**\n\n1. Photographiez le produit et l'emballage\n2. Ouvrez un litige depuis votre espace client\n3. Notre équipe intervient sous **24h**\n4. Remboursement ou renvoi organisé sous **5 jours**\n\nGardez toutes vos preuves photos !"
    ],
    quick: ['📸 Ouvrir un litige', '🔄 Initier un retour', '📞 Contacter support']
  },

  vendeur: {
    triggers: ['vendre','vendeur','boutique','créer','ouvrir','shop','seller','commission','inscription vendeur','devenir vendeur','comment vendre'],
    answers: [
      "🏪 **Devenir vendeur sur MCP :**\n\n**Étapes simples :**\n1. Créez un compte gratuit\n2. Soumettez votre boutique\n3. Attendez validation (24-48h)\n4. Ajoutez vos produits\n5. Commencez à vendre !\n\n**Commission :** seulement **2 à 5%** par vente",
      "💼 **Avantages vendeurs MCP :**\n• ✓ Tableau de bord complet\n• ✓ Gestion des commandes\n• ✓ Studio Live & vidéos courts\n• ✓ Paiements sous 48h\n• ✓ Support dédié\n• ✓ Accès à +10 000 acheteurs en CI\n• ✓ Badge certification disponible",
      "📊 **Frais vendeur :**\n• Inscription : **Gratuite**\n• Mise en ligne produits : **Gratuite**\n• Commission par vente : **2 à 5%** selon catégorie\n• Retrait des fonds : **Gratuit** vers Mobile Money\n\nPas de frais fixes mensuels !"
    ],
    quick: ['📝 S\'inscrire vendeur', '💰 Voir les commissions', '🎬 Studio Live']
  },

  produit: {
    triggers: ['produit','article','cherche','trouver','disponible','stock','electronique','wax','karite','smartphone','ordinateur','téléphone','recherche','categories'],
    answers: [
      "🛍️ **Notre catalogue :**\nPlus de **12 000 produits** dans 9 grandes catégories :\n\n📱 Electronique · 👗 Mode & Wax · 🏠 Maison\n🌿 Santé · 💄 Beauté · 🍲 Alimentation\n⚽ Sport · 🚗 Auto & Moto · 💼 Bureau & Pro\n\nUtilisez la **barre de recherche** en haut ou parcourez les catégories.",
      "✅ **Vérifier la disponibilité :**\nLes stocks sont mis à jour en **temps réel**. Si un produit affiche « En stock », il est disponible immédiatement.\n\nActivez les **alertes de disponibilité** sur la fiche produit pour être notifié dès le retour en stock.",
      "🔍 **Trouver le meilleur prix :**\nUtilisez notre page **Recherche** avec les filtres prix, note et catégorie. Vous pouvez aussi comparer les offres de plusieurs vendeurs sur le même produit !"
    ],
    quick: ['🔍 Aller au catalogue', '📱 Electronique', '👗 Mode & Wax', '🌿 Santé']
  },

  promo: {
    triggers: ['promo','promotion','code','réduction','solde','offre','remise','discount','coupon','pas cher','moins cher'],
    answers: [
      "🎁 **Codes promo actifs :**\n\n• **BIENVENUE10** → -10% sur votre 1ère commande *(min. 20 000 FCFA)*\n• **MCP2025** → -5 000 FCFA dès 50 000 FCFA d'achat\n• **SANTE15** → -15% sur les produits Santé\n• **WAVE5** → -5% supplémentaires en payant par Wave\n\nEntrez le code à l'**étape paiement** au checkout."
    ],
    quick: ['🛒 Utiliser BIENVENUE10', '📦 Voir les promotions', '⚡ Ventes flash']
  },

  livraison: {
    triggers: ['livraison gratuite','frais de livraison','zone','bouake','yamoussoukro','abidjan','daloa','korhogo','san pedro','man','livrer'],
    answers: [
      "🚚 **Zones de livraison :**\n\n🟢 **Abidjan** (toutes communes)\n• Express : le jour même (avant 14h) — **1 500 FCFA**\n• Standard 24-48h — **Gratuit dès 15 000 FCFA**\n\n🟡 **Grandes villes CI**\nBouaké, Yamoussoukro, San Pedro, Daloa, Korhogo : **3-5 jours — 2 500 FCFA**\n\n🔵 **Toute la Côte d'Ivoire**\nAutres villes : **5-7 jours — sur devis**"
    ],
    quick: ['📍 Tarifs Abidjan', '🗺️ Livraison nationale', '⏱️ Délais exacts']
  },

  securite: {
    triggers: ['arnaque','sécurité','sécurisé','confiance','fiable','faux','escroquerie','signaler','fraude','safe','protéger'],
    answers: [
      "🛡️ **Acheter en sécurité sur MCP :**\n\n**Nos protections :**\n• Paiement retenu jusqu'à votre livraison\n• Vendeurs vérifiés et approuvés\n• Litige résolu sous 5 jours\n• Remboursement garanti\n\n**Règle d'or :** Ne payez **jamais** en dehors de la plateforme MCP.",
      "⚠️ **Signaux d'alerte :**\n• Vendeur qui demande de payer hors plateforme\n• Prix anormalement bas (3× moins cher que le marché)\n• Demande de frais de douane ou de transport\n• Pression pour décider vite\n\nEn cas de doute → **Signalez** ce vendeur immédiatement.",
      "🔐 **En cas de problème :**\n1. Contactez le vendeur (48h pour répondre)\n2. Ouvrez un litige depuis votre espace client\n3. Notre équipe intervient sous **24h**\n\nConsultez notre guide complet → **Acheter en sécurité**"
    ],
    quick: ['🛡️ Guide sécurité', '🚨 Signaler un vendeur', '⚖️ Ouvrir un litige']
  },

  contact: {
    triggers: ['contact','appeler','téléphone','whatsapp','email','mail','aide','support','service client','conseiller','humain','joindre','parler'],
    answers: [
      "📞 **Contacter notre équipe :**\n\n• 💬 **WhatsApp :** +225 07 00 00 00 00\n*(Réponse en moins de 2h, 7j/7)*\n• 📧 **Email :** support@marketcenterplace.ci\n• 📝 **Formulaire :** Page Contact\n\n**Horaires :** Lundi–Samedi, 8h–20h\nUrgences 7j/7 via WhatsApp",
      "👩‍💼 **Je suis Aya**, votre assistante virtuelle. Je réponds instantanément 24h/24.\n\nPour une question complexe ou un litige urgent, je vous mets en relation avec un **conseiller humain** disponible maintenant.\n\nSouhaitez-vous être contacté ?"
    ],
    quick: ['💬 WhatsApp direct', '📝 Formulaire contact', '⚖️ Ouvrir un litige']
  },

  compte: {
    triggers: ['compte','profil','mot de passe','connexion','inscription','créer compte','oublié','email','login','se connecter'],
    answers: [
      "👤 **Gérer votre compte :**\n\n• **Créer un compte :** cliquez sur « Connexion » en haut à droite\n• **Mot de passe oublié :** page Connexion → *Mot de passe oublié*\n• **Modifier votre profil :** Mon compte → Paramètres\n\n**Connexion rapide via :** Google, Facebook, Apple ou WhatsApp"
    ],
    quick: ['🔑 Se connecter', '👤 Créer un compte', '🔒 Mot de passe oublié']
  },

  merci: {
    triggers: ['merci','thank','super','parfait','excellent','bien','ok','ça marche','top','cool','nickel','bravo','génial'],
    answers: [
      "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Bonne visite sur MCP ! 🛍️",
      "Ravie d'avoir pu vous aider ! Profitez bien de votre shopping sur Market Center Place.",
      "C'est tout pour moi. Bonne commande et bonne journée !"
    ],
    quick: ['🛍️ Voir le catalogue', '📦 Mes commandes', '🏪 Nos promotions']
  },

  default: {
    answers: [
      "Je ne suis pas sûre de comprendre votre question. Pouvez-vous reformuler ?\n\nJe peux vous aider avec :\n• Commandes et livraisons\n• Paiements et remboursements\n• Produits et catalogue\n• Devenir vendeur\n• Sécurité des achats",
      "Hmm, je n'ai pas bien saisi. Essayez par exemple :\n*« Comment suivre ma commande ? »*\n*« Quels modes de paiement ? »*\n*« Comment devenir vendeur ? »*",
      "Pour cette question spécifique, je vous conseille de contacter directement notre équipe sur **WhatsApp : +225 07 00 00 00 00**. Ils pourront vous répondre en quelques minutes."
    ],
    quick: ['📦 Mes commandes', '💳 Paiements', '📞 Contacter support']
  }
};

/* ════════════════════════════════════════════════
   STYLES PREMIUM
   ════════════════════════════════════════════════ */
function injectStyles() {
  if (document.getElementById('aya-styles')) return;
  const s = document.createElement('style');
  s.id = 'aya-styles';
  s.textContent = `
    /* ── ANIMATIONS ── */
    @keyframes ayaFabPop    { from{transform:scale(0) rotate(-180deg)} to{transform:scale(1) rotate(0)} }
    @keyframes ayaFabPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(192,32,42,.4)} 70%{box-shadow:0 0 0 14px rgba(192,32,42,0)} }
    @keyframes ayaWindowIn  { from{opacity:0;transform:scale(.88) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes ayaWindowOut { from{opacity:1;transform:scale(1) translateY(0)} to{opacity:0;transform:scale(.88) translateY(20px)} }
    @keyframes ayaMsgIn     { from{opacity:0;transform:translateY(10px) scale(.96)} to{opacity:1;transform:none} }
    @keyframes ayaTyping    { 0%,80%,100%{transform:scale(0);opacity:.4} 40%{transform:scale(1);opacity:1} }
    @keyframes ayaBadgePop  { from{transform:scale(0)} 80%{transform:scale(1.3)} to{transform:scale(1)} }
    @keyframes ayaShimmer   { 0%{left:-100%} 100%{left:100%} }
    @keyframes ayaSpin      { to{transform:rotate(360deg)} }
    @keyframes ayaGlow      { 0%,100%{box-shadow:0 0 8px rgba(200,168,75,.3)} 50%{box-shadow:0 0 20px rgba(200,168,75,.7)} }

    /* ── FAB ── */
    #aya-fab {
      position: fixed; bottom: 28px; right: 28px;
      width: 62px; height: 62px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0b1f4b 0%, #162d6e 100%);
      border: none; cursor: pointer; z-index: 9998;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 32px rgba(11,31,75,.5), 0 2px 8px rgba(0,0,0,.2);
      transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
      animation: ayaFabPop .5s cubic-bezier(.34,1.56,.64,1) .3s both;
      overflow: visible;
      outline: none;
    }
    #aya-fab:hover {
      transform: scale(1.1) translateY(-3px);
      box-shadow: 0 16px 48px rgba(11,31,75,.6);
    }
    #aya-fab:active { transform: scale(.95); }
    #aya-fab.is-pulsing { animation: ayaFabPulse 2s ease-in-out infinite; }
    #aya-fab-icon, #aya-fab-close {
      position: absolute;
      transition: transform .4s cubic-bezier(.34,1.56,.64,1), opacity .25s;
    }
    #aya-fab-icon  { opacity:1; transform:scale(1) rotate(0); }
    #aya-fab-close { opacity:0; transform:scale(.5) rotate(90deg); }
    #aya-fab.open #aya-fab-icon  { opacity:0; transform:scale(.5) rotate(-90deg); }
    #aya-fab.open #aya-fab-close { opacity:1; transform:scale(1) rotate(0); }

    /* Badge */
    #aya-badge {
      position: absolute; top: -3px; right: -3px;
      min-width: 20px; height: 20px;
      background: #c0202a; border-radius: 99px;
      border: 2.5px solid white;
      font-family: 'Montserrat', sans-serif;
      font-size: .58rem; font-weight: 900; color: white;
      display: none; align-items: center; justify-content: center;
      padding: 0 4px;
      animation: ayaBadgePop .35s cubic-bezier(.34,1.56,.64,1);
    }
    #aya-badge.show { display: flex; }

    /* ── FENÊTRE ── */
    #aya-window {
      position: fixed; bottom: 106px; right: 28px;
      width: 370px; height: 580px;
      border-radius: 20px;
      background: #ffffff;
      box-shadow: 0 24px 80px rgba(11,31,75,.22), 0 8px 24px rgba(0,0,0,.1);
      z-index: 9997;
      display: flex; flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      font-family: 'Montserrat', sans-serif;
    }
    #aya-window.entering { animation: ayaWindowIn  .4s cubic-bezier(.34,1.56,.64,1) both; }
    #aya-window.leaving  { animation: ayaWindowOut .3s cubic-bezier(.4,0,.2,1) both; }
    #aya-window.hidden   { display: none !important; }

    /* ── HEADER ── */
    #aya-header {
      background: linear-gradient(135deg, #0b1f4b 0%, #162d6e 100%);
      padding: 0; flex-shrink: 0; position: relative; overflow: hidden;
    }
    #aya-header::before {
      content: ''; position: absolute;
      top: -30px; right: -30px; width: 130px; height: 130px;
      border-radius: 50%; background: rgba(200,168,75,.1);
    }
    #aya-header::after {
      content: ''; position: absolute;
      bottom: -15px; left: 30px; width: 80px; height: 80px;
      border-radius: 50%; background: rgba(192,32,42,.1);
    }
    #aya-header-top {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 16px 10px; position: relative; z-index: 1;
    }
    #aya-avatar {
      width: 42px; height: 42px; border-radius: 50%;
      background: linear-gradient(135deg, #c0202a, #e8282f);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 14px rgba(192,32,42,.45);
      position: relative;
      animation: ayaGlow 3s ease-in-out infinite;
    }
    #aya-avatar::after {
      content: ''; position: absolute;
      bottom: 2px; right: 2px;
      width: 11px; height: 11px; border-radius: 50%;
      background: #22c55e; border: 2px solid white;
    }
    #aya-info { flex: 1; }
    #aya-name {
      font-size: .88rem; font-weight: 900; color: white;
      letter-spacing: -.2px; line-height: 1.1;
    }
    #aya-status {
      font-size: .62rem; font-weight: 600;
      color: rgba(255,255,255,.55);
      display: flex; align-items: center; gap: 4px;
      margin-top: 1px;
    }
    .aya-status-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #22c55e; flex-shrink: 0;
      animation: ayaTyping 2s ease-in-out infinite;
    }
    #aya-header-close {
      background: rgba(255,255,255,.1); border: none;
      border-radius: 50%; width: 30px; height: 30px;
      cursor: pointer; display: flex; align-items: center;
      justify-content: center; transition: background .2s;
      flex-shrink: 0;
    }
    #aya-header-close:hover { background: rgba(255,255,255,.2); }
    #aya-header-close svg { stroke: white; }

    /* Barre promo */
    #aya-promo {
      background: rgba(200,168,75,.15);
      border-top: 1px solid rgba(200,168,75,.22);
      padding: 7px 16px;
      font-size: .62rem; font-weight: 700;
      color: #c8a84b;
      display: flex; align-items: center; gap: 6px;
      position: relative; z-index: 1;
      letter-spacing: .3px;
      overflow: hidden;
    }
    #aya-promo::after {
      content: ''; position: absolute;
      top: 0; left: -100%;
      width: 60%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent);
      animation: ayaShimmer 2.5s ease-in-out infinite;
    }
    .aya-promo-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #c8a84b; flex-shrink: 0;
      animation: ayaTyping 1.8s ease-in-out infinite;
    }

    /* ── MESSAGES ── */
    #aya-msgs {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 8px;
      background: #f8f9fd;
      scroll-behavior: smooth;
    }
    #aya-msgs::-webkit-scrollbar { width: 4px; }
    #aya-msgs::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }

    /* Message */
    .aya-msg {
      display: flex; gap: 8px; align-items: flex-end;
      animation: ayaMsgIn .35s cubic-bezier(.34,1.2,.64,1);
    }
    .aya-msg.user { flex-direction: row-reverse; }
    .aya-msg-av {
      width: 28px; height: 28px; border-radius: 50%;
      background: linear-gradient(135deg, #c0202a, #e8282f);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-bottom: 2px;
    }
    .aya-msg-av svg { stroke: white; }
    .aya-msg-group { display: flex; flex-direction: column; max-width: 83%; }
    .aya-msg.user .aya-msg-group { align-items: flex-end; }
    .aya-msg.bot  .aya-msg-group { align-items: flex-start; }
    .aya-bubble {
      padding: 10px 13px; border-radius: 16px;
      font-size: .79rem; line-height: 1.65; font-weight: 500;
      white-space: pre-wrap; word-break: break-word;
    }
    .aya-msg.bot .aya-bubble {
      background: white; color: #080e20;
      border-radius: 4px 16px 16px 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
    }
    .aya-msg.user .aya-bubble {
      background: linear-gradient(135deg, #0b1f4b, #162d6e);
      color: white;
      border-radius: 16px 4px 16px 16px;
      box-shadow: 0 4px 12px rgba(11,31,75,.28);
    }
    .aya-bubble strong { font-weight: 800; }
    .aya-time {
      font-size: .54rem; color: #94a3b8;
      font-weight: 500; margin-top: 3px; padding: 0 3px;
    }

    /* Message système */
    .aya-msg.system {
      justify-content: center; animation: ayaMsgIn .3s ease;
    }
    .aya-msg.system .aya-sys-bubble {
      background: rgba(11,31,75,.06);
      border-radius: 99px;
      padding: 4px 14px;
      font-size: .65rem; font-weight: 700; color: #64748b;
    }

    /* Typing */
    #aya-typing {
      display: flex; gap: 8px; align-items: flex-end;
      animation: ayaMsgIn .3s ease;
    }
    .aya-typing-dots {
      background: white; border-radius: 4px 16px 16px 16px;
      padding: 12px 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,.07);
      display: flex; gap: 5px; align-items: center;
    }
    .aya-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #cbd5e1;
      animation: ayaTyping 1.3s ease-in-out infinite;
    }
    .aya-dot:nth-child(2) { animation-delay: .2s; }
    .aya-dot:nth-child(3) { animation-delay: .4s; }

    /* ── SUGGESTIONS RAPIDES ── */
    #aya-quick {
      padding: 8px 12px 4px;
      display: flex; gap: 6px; flex-wrap: wrap;
      background: #f8f9fd;
      border-top: 1px solid rgba(0,0,0,.05);
      flex-shrink: 0;
    }
    .aya-quick-btn {
      background: white; border: 1.5px solid #e8edf5;
      border-radius: 20px; padding: 5px 12px;
      font-family: 'Montserrat', sans-serif;
      font-size: .67rem; font-weight: 700; color: #0b1f4b;
      cursor: pointer; transition: all .2s; flex-shrink: 0;
      white-space: nowrap;
    }
    .aya-quick-btn:hover {
      background: #0b1f4b; border-color: #0b1f4b;
      color: white; transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(11,31,75,.2);
    }
    .aya-quick-btn:active { transform: scale(.96); }

    /* ── INPUT ── */
    #aya-input-wrap {
      padding: 10px 12px 14px; background: white;
      border-top: 1px solid #e8edf5;
      display: flex; gap: 8px; align-items: flex-end;
      flex-shrink: 0;
    }
    #aya-input {
      flex: 1; background: #f4f6fb;
      border: 1.5px solid #e8edf5; border-radius: 22px;
      padding: 9px 14px;
      font-family: 'Montserrat', sans-serif;
      font-size: .8rem; color: #080e20;
      outline: none; resize: none;
      max-height: 80px; line-height: 1.5;
      transition: border .2s, background .2s;
    }
    #aya-input:focus { border-color: #0b1f4b; background: white; }
    #aya-input::placeholder { color: #94a3b8; }
    #aya-send {
      width: 38px; height: 38px; border-radius: 50%;
      background: #0b1f4b; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: background .2s, transform .15s;
    }
    #aya-send:hover { background: #c0202a; transform: scale(1.08); }
    #aya-send:active { transform: scale(.9); }
    #aya-send svg { stroke: white; }

    /* ── PIED ── */
    #aya-footer {
      padding: 6px 14px 8px; background: white;
      text-align: center;
      font-size: .6rem; font-weight: 600;
      color: #94a3b8; flex-shrink: 0;
      border-top: 1px solid #f4f6fb;
    }
    #aya-footer a { color: #c8a84b; text-decoration: none; font-weight: 700; }

    /* ── INDICATEUR EN TRAIN D'ÉCRIRE ── */
    #aya-status-bar {
      padding: 3px 14px;
      font-size: .6rem; font-weight: 600; color: #94a3b8;
      background: white; border-top: 1px solid #f4f6fb;
      display: none; align-items: center; gap: 5px; flex-shrink: 0;
    }
    #aya-status-bar.visible { display: flex; }
    #aya-status-bar svg { stroke: #22c55e; animation: ayaSpin .8s linear infinite; }

    /* ── RESPONSIVE ── */
    @media(max-width:420px) {
      #aya-window { width:calc(100vw - 24px); right:12px; bottom:96px; height:500px; }
      #aya-fab    { right:16px; bottom:20px; }
    }
  `;
  document.head.appendChild(s);
}

/* ════════════════════════════════════════════════
   CONSTRUCTION HTML
   ════════════════════════════════════════════════ */
function buildHTML() {
  const wrap = document.createElement('div');
  wrap.id = 'aya-chatbot';
  wrap.innerHTML = `
    <!-- FAB -->
    <button id="aya-fab" onclick="ayaToggle()" aria-label="Assistant Aya">
      <!-- Icône chat -->
      <svg id="aya-fab-icon" width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <line x1="9" y1="10" x2="15" y2="10"/>
        <line x1="9" y1="14" x2="13" y2="14"/>
      </svg>
      <!-- Icône fermer -->
      <svg id="aya-fab-close" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <!-- Badge -->
      <span id="aya-badge">1</span>
    </button>

    <!-- FENÊTRE -->
    <div id="aya-window" class="hidden">

      <!-- HEADER -->
      <div id="aya-header">
        <div id="aya-header-top">
          <div id="aya-avatar">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.8">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <div id="aya-info">
            <div id="aya-name">Aya &mdash; Assistante MCP</div>
            <div id="aya-status">
              <span class="aya-status-dot"></span>
              En ligne &bull; Répond instantanément
            </div>
          </div>
          <button id="aya-header-close" onclick="ayaToggle()" aria-label="Fermer">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div id="aya-promo">
          <span class="aya-promo-dot"></span>
          Code BIENVENUE10 — -10% sur votre 1ère commande
        </div>
      </div>

      <!-- MESSAGES -->
      <div id="aya-msgs"></div>

      <!-- INDICATEUR ÉCRITURE -->
      <div id="aya-status-bar">
        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>
        Aya est en train d'écrire...
      </div>

      <!-- SUGGESTIONS -->
      <div id="aya-quick"></div>

      <!-- INPUT -->
      <div id="aya-input-wrap">
        <textarea id="aya-input" rows="1" placeholder="Posez votre question..."
          onkeydown="ayaKeydown(event)"
          oninput="ayaResize(this)"></textarea>
        <button id="aya-send" onclick="ayaSend()" aria-label="Envoyer">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke-width="2.2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      <!-- PIED -->
      <div id="aya-footer">
        Propulsé par <a href="index.html">Market Center Place</a> &bull; Côte d'Ivoire
      </div>

    </div>
  `;
  document.body.appendChild(wrap);
}

/* ════════════════════════════════════════════════
   ÉTAT
   ════════════════════════════════════════════════ */
let AYA = {
  open:         false,
  typing:       false,
  welcomed:     false,
  lastCat:      null,
  msgCount:     0,
  typingTimer:  null,
  proactiveTimer: null,
  sessionStart: Date.now(),
};

/* ════════════════════════════════════════════════
   LOGIQUE
   ════════════════════════════════════════════════ */
function normalize(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');
}

function getResponse(input) {
  const q = normalize(input);
  for (const [cat, data] of Object.entries(KB)) {
    if (cat === 'default') continue;
    if (data.triggers?.some(t => q.includes(normalize(t)))) {
      AYA.lastCat = cat;
      const answers = data.answers;
      return { text: answers[Math.floor(Math.random() * answers.length)], cat };
    }
  }
  return { text: KB.default.answers[Math.floor(Math.random() * KB.default.answers.length)], cat: null };
}

function getQuickReplies(cat) {
  if (cat && KB[cat]?.quick) return KB[cat].quick;
  return ['📦 Mes commandes', '💳 Paiements', '🏪 Devenir vendeur', '🛡️ Sécurité'];
}

function getTime() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatText(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/→ /g, '→ ');
}

/* ════════════════════════════════════════════════
   AFFICHAGE MESSAGES
   ════════════════════════════════════════════════ */
function addMsg(text, sender, isSystem) {
  const container = document.getElementById('aya-msgs');
  if (!container) return;

  if (isSystem) {
    const el = document.createElement('div');
    el.className = 'aya-msg system';
    el.innerHTML = `<span class="aya-sys-bubble">${text}</span>`;
    container.appendChild(el);
    scrollBottom();
    return;
  }

  const isBot = sender === 'bot';
  const el    = document.createElement('div');
  el.className = `aya-msg ${isBot ? 'bot' : 'user'}`;
  el.innerHTML = `
    ${isBot ? `<div class="aya-msg-av"><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>` : ''}
    <div class="aya-msg-group">
      <div class="aya-bubble">${formatText(text)}</div>
      <div class="aya-time">${getTime()}</div>
    </div>
  `;
  container.appendChild(el);

  // Limiter le nombre de messages
  while (container.children.length > CFG.maxMsgs) {
    container.removeChild(container.firstChild);
  }

  scrollBottom();
  AYA.msgCount++;
}

function showTyping() {
  const container = document.getElementById('aya-msgs');
  if (!container) return;
  removeTyping();
  const el = document.createElement('div');
  el.id = 'aya-typing-el';
  el.id = 'aya-typing';
  el.innerHTML = `
    <div class="aya-msg-av">
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
    </div>
    <div class="aya-typing-dots">
      <div class="aya-dot"></div>
      <div class="aya-dot"></div>
      <div class="aya-dot"></div>
    </div>
  `;
  container.appendChild(el);
  scrollBottom();

  const sb = document.getElementById('aya-status-bar');
  if (sb) sb.classList.add('visible');
}

function removeTyping() {
  const el = document.getElementById('aya-typing');
  if (el) el.remove();
  const sb = document.getElementById('aya-status-bar');
  if (sb) sb.classList.remove('visible');
}

function renderQuick(replies) {
  const wrap = document.getElementById('aya-quick');
  if (!wrap) return;
  wrap.innerHTML = replies.map(r =>
    `<button class="aya-quick-btn" onclick="ayaQuick(this,'${r}')">${r}</button>`
  ).join('');
}

function scrollBottom() {
  const c = document.getElementById('aya-msgs');
  if (c) setTimeout(() => { c.scrollTop = c.scrollHeight; }, 50);
}

/* ════════════════════════════════════════════════
   RÉPONSE BOT AVEC DÉLAI
   ════════════════════════════════════════════════ */
function botReply(input) {
  if (AYA.typing) return;
  AYA.typing = true;

  const delay   = CFG.typingDelay;
  const typing  = CFG.typingMin + Math.random() * (CFG.typingMax - CFG.typingMin);

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      removeTyping();
      const { text, cat } = getResponse(input);
      addMsg(text, 'bot');
      renderQuick(getQuickReplies(cat));
      AYA.typing = false;
    }, typing);
  }, delay);
}

/* ════════════════════════════════════════════════
   FONCTIONS PUBLIQUES
   ════════════════════════════════════════════════ */
window.ayaToggle = function() {
  const win   = document.getElementById('aya-window');
  const fab   = document.getElementById('aya-fab');
  const badge = document.getElementById('aya-badge');
  if (!win) return;

  AYA.open = !AYA.open;

  if (AYA.open) {
    // Ouvrir
    win.classList.remove('hidden', 'leaving');
    win.classList.add('entering');
    fab.classList.add('open');
    if (badge) badge.classList.remove('show');
    clearTimeout(AYA.proactiveTimer);

    // Message de bienvenue
    if (!AYA.welcomed) {
      AYA.welcomed = true;
      const msgs = document.getElementById('aya-msgs');
      if (msgs) msgs.innerHTML = '';

      setTimeout(() => {
        addMsg('Bonjour et bienvenue sur **Market Center Place** !', 'bot');
      }, 350);
      setTimeout(() => {
        addMsg("Je suis **Aya**, votre assistante virtuelle. Je suis là pour vous aider avec vos commandes, paiements, produits ou toute autre question.\n\nComment puis-je vous aider aujourd'hui ?", 'bot');
        renderQuick(['📦 Suivi commande', '💳 Modes de paiement', '🏪 Devenir vendeur', '🛍️ Voir le catalogue']);
      }, 1200);
    }

    setTimeout(() => document.getElementById('aya-input')?.focus(), 500);
  } else {
    // Fermer
    win.classList.remove('entering');
    win.classList.add('leaving');
    fab.classList.remove('open');
    setTimeout(() => {
      win.classList.add('hidden');
      win.classList.remove('leaving');
    }, 300);
  }
};

window.ayaSend = function() {
  const input = document.getElementById('aya-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text || AYA.typing) return;
  addMsg(text, 'user');
  input.value = '';
  input.style.height = 'auto';
  botReply(text);
};

window.ayaQuick = function(btn, text) {
  if (AYA.typing) return;
  // Retirer les accents pour recherche
  const clean = text.replace(/[^\w\sàâéèêëîïôùûüç]/g, '').trim();
  addMsg(text, 'user');
  // Chercher dans la KB par la suggestion
  let found = false;
  for (const [cat, data] of Object.entries(KB)) {
    if (cat === 'default') continue;
    if (data.quick?.includes(text)) {
      AYA.lastCat = cat;
      AYA.typing = true;
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          removeTyping();
          const answers = data.answers;
          addMsg(answers[Math.floor(Math.random() * answers.length)], 'bot');
          renderQuick(getQuickReplies(cat));
          AYA.typing = false;
        }, CFG.typingMin + Math.random() * (CFG.typingMax - CFG.typingMin));
      }, CFG.typingDelay);
      found = true;
      break;
    }
  }
  if (!found) botReply(clean);
};

window.ayaKeydown = function(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ayaSend(); }
};

window.ayaResize = function(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 80) + 'px';
};

/* ════════════════════════════════════════════════
   NOTIFICATION PROACTIVE
   ════════════════════════════════════════════════ */
function showProactive() {
  if (AYA.open || AYA.welcomed) return;
  const badge = document.getElementById('aya-badge');
  const fab   = document.getElementById('aya-fab');
  if (badge) badge.classList.add('show');
  if (fab) fab.classList.add('is-pulsing');
  setTimeout(() => fab?.classList.remove('is-pulsing'), 2500);
}

/* ════════════════════════════════════════════════
   INITIALISATION
   ════════════════════════════════════════════════ */
function init() {
  injectStyles();
  buildHTML();

  // Notification proactive après 9s
  AYA.proactiveTimer = setTimeout(showProactive, CFG.proactiveMs);

  // Notification si inactif 50s
  let inactiveTimer;
  const resetInactivity = () => {
    clearTimeout(inactiveTimer);
    if (!AYA.open) inactiveTimer = setTimeout(showProactive, CFG.inactiveMs);
  };
  ['mousemove','scroll','click'].forEach(ev =>
    document.addEventListener(ev, resetInactivity, { passive: true })
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
