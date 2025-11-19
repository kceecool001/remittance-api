const Joi = require('joi');

const validateTransfer = (req, res, next) => {
  const schema = Joi.object({
    beneficiaryId: Joi.string().uuid().required(),
    sourceAmount: Joi.number().positive().max(100000).required(),
    sourceCurrency: Joi.string().length(3).uppercase().required(),
    destinationCurrency: Joi.string().length(3).uppercase().required(),
    paymentMethod: Joi.string().valid('bank_transfer', 'card', 'wallet').required(),
    purpose: Joi.string().max(200).optional(),
    notes: Joi.string().max(500).optional()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }

  next();
};

const validateBeneficiary = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    country: Joi.string().length(2).uppercase().required(),
    currency: Joi.string().length(3).uppercase().required(),
    bankName: Joi.string().max(200).optional(),
    accountNumber: Joi.string().min(5).max(50).required(),
    routingNumber: Joi.string().max(50).optional(),
    swiftCode: Joi.string().length(8).or(Joi.string().length(11)).optional(),
    iban: Joi.string().max(34).optional(),
    accountType: Joi.string().valid('checking', 'savings').optional()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }

  next();
};

const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    country: Joi.string().length(2).uppercase().optional()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }

  next();
};

module.exports = {
  validateTransfer,
  validateBeneficiary,
  validateRegistration
};