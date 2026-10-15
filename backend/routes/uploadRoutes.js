const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// @route   POST /api/upload
// @desc    Upload an image file using Multer
// @access  Public
router.post('/', upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
      });
    }

    const serverBase = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${serverBase}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
