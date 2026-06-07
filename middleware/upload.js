// ============================================================
// MARKET CENTER PLACE — Upload images (Multer + Cloudinary)
// ============================================================

const multer     = require('multer');
const path       = require('path');
const https      = require('https');
const http       = require('http');

// ── MULTER : stockage en mémoire ────────────────────────────
// On stocke en RAM, puis on envoie directement à Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format non accepté. Utilisez JPG, PNG ou WebP.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
});

// ── CLOUDINARY : upload direct ───────────────────────────────
async function uploadToCloudinary(buffer, options = {}) {
  const { folder = 'mcp/produits', publicId } = options;

  return new Promise((resolve, reject) => {
    const base64 = buffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;

    const body = JSON.stringify({
      file:        dataUri,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'mcp_products',
      folder,
      public_id:   publicId,
      transformation: [
        { width: 800, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
      ],
    });

    const options_req = {
      hostname: 'api.cloudinary.com',
      path:     `/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization':  'Basic ' + Buffer.from(
          `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`
        ).toString('base64'),
      },
    };

    const req = https.request(options_req, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        if (json.error) reject(new Error(json.error.message));
        else resolve({ url: json.secure_url, public_id: json.public_id });
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── ROUTE : upload image produit ────────────────────────────
// À ajouter dans server.js :
// app.post('/api/upload/product', authMiddleware(['vendeur']), upload.array('images', 4), uploadProductImages);

async function uploadProductImages(req, res) {
  if (!req.files || !req.files.length) {
    return res.status(400).json({ error: 'Aucune image fournie' });
  }

  try {
    const urls = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, {
        folder: `mcp/produits/${req.user.vendeur_id}`,
      });
      urls.push(result.url);
    }
    res.json({ urls });
  } catch (err) {
    console.error('Upload erreur:', err);
    res.status(500).json({ error: 'Erreur upload image' });
  }
}

module.exports = { upload, uploadToCloudinary, uploadProductImages };
