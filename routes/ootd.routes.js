const express = require('express');
const router = express.Router();
const controller = require('../controllers/ootd.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/', controller.getAllOotds);
router.get('/:id', controller.getOotdById);

// Protected routes (requires token)
// Use 'image' as the field name for file uploads
router.post('/', [verifyToken, upload.single('image')], controller.createOotd);
router.put('/:id', [verifyToken, upload.single('image')], controller.updateOotd);
router.delete('/:id', [verifyToken], controller.deleteOotd);

module.exports = router;