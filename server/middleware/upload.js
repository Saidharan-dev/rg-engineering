const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = new Set(['.jpeg', '.jpg', '.png', '.webp', '.svg']);
  const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);
  const ext = allowedExtensions.has(path.extname(file.originalname).toLowerCase());
  const mime = allowedMimeTypes.has(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only JPG, PNG, WebP, or SVG image files are allowed.'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
