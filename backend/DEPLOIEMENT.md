# Guide de déploiement — Market Center Place
## Version sécurisée — 19 étapes

---

### ÉTAPE 1 — Acheter le domaine
- Aller sur https://www.nic.ci
- Enregistrer marketcenterplace.ci (~5 000 FCFA/an)

### ÉTAPE 2 — Louer le VPS OVH
- https://www.ovhcloud.com/fr/vps/
- Choisir VPS Starter Ubuntu 22.04 LTS (~3 000 FCFA/mois)
- Région : France (latence correcte pour la CI)

### ÉTAPE 3 — Sécuriser le serveur SSH
```bash
# Connexion initiale
ssh root@VOTRE_IP_VPS

# Mettre à jour le système
apt update && apt upgrade -y

# Créer un utilisateur non-root
adduser mcp
usermod -aG sudo mcp

# Changer le port SSH (sécurité)
nano /etc/ssh/sshd_config
# Changer : Port 22 → Port 2222
# Ajouter : PermitRootLogin no
systemctl restart sshd
```

### ÉTAPE 4 — Pare-feu UFW
```bash
ufw allow 2222/tcp   # SSH nouveau port
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw deny 3306/tcp    # MySQL — jamais exposé
ufw enable
ufw status
```

### ÉTAPE 5 — Installer Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
node --version  # Doit afficher v20.x.x
```

### ÉTAPE 6 — Installer MySQL
```bash
apt install -y mysql-server
mysql_secure_installation  # Suivre les instructions

# Créer la base et l'utilisateur MCP
mysql -u root -p
CREATE DATABASE mcp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mcp_user'@'127.0.0.1' IDENTIFIED BY 'MOT_DE_PASSE_FORT';
GRANT ALL PRIVILEGES ON mcp_db.* TO 'mcp_user'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;

# Importer le schema
mysql -u mcp_user -p mcp_db < backend/database/schema.sql
```

### ÉTAPE 7 — Installer Nginx
```bash
apt install -y nginx
```

### ÉTAPE 8 — Configuration Nginx
```nginx
# /etc/nginx/sites-available/marketcenterplace.ci
server {
    listen 80;
    server_name marketcenterplace.ci www.marketcenterplace.ci;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name marketcenterplace.ci www.marketcenterplace.ci;

    ssl_certificate     /etc/letsencrypt/live/marketcenterplace.ci/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/marketcenterplace.ci/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers on;

    # Headers sécurité supplémentaires
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Fichiers statiques
    root /var/www/marketcenterplace;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers l'API Node.js
    location /api/ {
        proxy_pass         http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 10m;
    }
}
```
```bash
ln -s /etc/nginx/sites-available/marketcenterplace.ci /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### ÉTAPE 9 — Certificat SSL Let's Encrypt (GRATUIT)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d marketcenterplace.ci -d www.marketcenterplace.ci
# Renouvellement automatique
crontab -e
0 12 * * * certbot renew --quiet
```

### ÉTAPE 10 — Déployer les fichiers HTML
```bash
mkdir -p /var/www/marketcenterplace
# Uploader tous les fichiers HTML/CSS/JS via SFTP ou rsync
rsync -avz ./ mcp@VOTRE_IP:/var/www/marketcenterplace/ --exclude=backend
chown -R www-data:www-data /var/www/marketcenterplace
chmod -R 755 /var/www/marketcenterplace
```

### ÉTAPE 11 — Déployer le backend
```bash
mkdir -p /var/www/mcp-api
cd /var/www/mcp-api
cp -r backend/* .
npm install --production

# Créer le fichier .env
cp .env.example .env
nano .env  # Remplir toutes les valeurs
```

### ÉTAPE 12 — PM2 (garder l'API en ligne)
```bash
npm install -g pm2
pm2 start server.js --name "mcp-api"
pm2 startup  # Pour démarrer au boot
pm2 save
pm2 logs mcp-api  # Voir les logs
```

### ÉTAPE 13 — Configurer le fichier .env
Remplir toutes les valeurs du fichier .env :
- JWT_SECRET : générer avec `openssl rand -hex 32`
- DB_PASSWORD : mot de passe MySQL fort
- Clés CinetPay, Wave, Twilio, Cloudinary

### ÉTAPE 14 — Activer CinetPay
- Créer compte sur cinetpay.com
- Valider l'entreprise (2-5 jours)
- Copier API_KEY, SITE_ID et SECRET dans .env

### ÉTAPE 15 — Activer Wave CI
- Envoyer email à business@wave.com
- Décrire votre activité marketplace
- Intégrer les clés reçues dans .env

### ÉTAPE 16 — Activer Cloudinary (images)
- Créer compte gratuit sur cloudinary.com
- Copier Cloud Name, API Key, Secret dans .env

### ÉTAPE 17 — Google OAuth (connexion sociale)
- console.cloud.google.com → Créer projet
- APIs → Credentials → OAuth 2.0 Client ID
- Ajouter dans .env

### ÉTAPE 18 — Sauvegardes automatiques
```bash
mkdir -p /backup/mysql
crontab -e
# Backup MySQL chaque nuit à 2h
0 2 * * * mysqldump -u mcp_user -pVOTRE_PASS mcp_db | gzip > /backup/mysql/mcp_$(date +%Y%m%d).sql.gz
# Garder 30 jours seulement
0 3 * * * find /backup/mysql -mtime +30 -delete
```

### ÉTAPE 19 — Vérification finale
```bash
# Tester l'API
curl https://marketcenterplace.ci/health

# Vérifier les logs
pm2 logs mcp-api

# Vérifier SSL
curl -I https://marketcenterplace.ci

# Vérifier le pare-feu
ufw status verbose
```

---

## Coûts mensuels

| Service         | Coût          |
|-----------------|---------------|
| Domaine .ci     | ~420 FCFA     |
| VPS OVH         | ~3 000 FCFA   |
| SSL             | GRATUIT       |
| Cloudinary      | GRATUIT       |
| CinetPay        | 2-3% par vente|
| Wave CI         | ~1% par vente |
| **Total fixe**  | **~3 420 FCFA/mois** |

---

## Contact support
- WhatsApp & Appels : **07 68 91 71 64**
- Site : marketcenterplace.ci
