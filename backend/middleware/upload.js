const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_UPLOAD_SIZE_MB,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_MIME_TYPES,
} = require('../config/constants');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `recipe-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const isValidExt = ALLOWED_IMAGE_EXTENSIONS.includes(ext);
  const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype);

  if (isValidExt && isValidMime) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        `Allowed image formats: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')} (Max ${MAX_UPLOAD_SIZE_MB}MB)`
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: fileFilter,
});

module.exports = upload;
