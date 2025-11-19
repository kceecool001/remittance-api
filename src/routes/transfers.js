const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const auth = require('../middleware/auth');
const { validateTransfer } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

// Rate limiting
const transferLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many transfer requests, please try again later'
});

// All routes require authentication
router.use(auth);

// Create a new transfer
router.post('/', transferLimiter, validateTransfer, transferController.createTransfer);

// Get all transfers for authenticated user
router.get('/', transferController.getTransfers);

// Get a specific transfer
router.get('/:id', transferController.getTransferById);

// Get transfer receipt
router.get('/:id/receipt', transferController.getTransferReceipt);

// Cancel a transfer
router.post('/:id/cancel', transferController.cancelTransfer);

// Get exchange rate quote
router.post('/quote', transferController.getQuote);

module.exports = router;