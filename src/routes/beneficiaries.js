const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');
const auth = require('../middleware/auth');
const { validateBeneficiary } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

// Limit beneficiary creation/update requests
const beneficiaryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: 'Too many beneficiary requests. Please slow down.'
});

// All routes require login
router.use(auth);

// Create beneficiary
router.post('/', beneficiaryLimiter, validateBeneficiary, beneficiaryController.createBeneficiary);

// Get all beneficiaries for user
router.get('/', beneficiaryController.getBeneficiaries);

// Get a specific beneficiary
router.get('/:id', beneficiaryController.getBeneficiaryById);

// Update beneficiary
router.put('/:id', beneficiaryLimiter, validateBeneficiary, beneficiaryController.updateBeneficiary);

// Delete beneficiary
router.delete('/:id', beneficiaryController.deleteBeneficiary);

module.exports = router;
