const Transfer = require('../models/Transfer');
const Beneficiary = require('../models/Beneficiary');
const logger = require('../utils/logger');
const { generateReference } = require('../utils/helpers');
const exchangeService = require('../services/exchangeService');
const paymentProcessor = require('../services/paymentProcessor');

class TransferController {
  async createTransfer(req, res, next) {
    try {
      const userId = req.user.id;
      const {
        beneficiaryId,
        sourceAmount,
        sourceCurrency,
        destinationCurrency,
        paymentMethod,
        purpose,
        notes
      } = req.body;

      // Verify beneficiary belongs to user
      const beneficiary = await Beneficiary.findOne({
        where: { id: beneficiaryId, userId, isActive: true }
      });

      if (!beneficiary) {
        return res.status(404).json({
          error: 'Beneficiary not found or inactive'
        });
      }

      // Get exchange rate
      const rate = await exchangeService.getRate(sourceCurrency, destinationCurrency);
      const destinationAmount = (sourceAmount * rate.rate).toFixed(2);
      const fee = await exchangeService.calculateFee(sourceAmount, sourceCurrency);

      // Create transfer record
      const transfer = await Transfer.create({
        userId,
        beneficiaryId,
        sourceAmount,
        sourceCurrency,
        destinationAmount,
        destinationCurrency,
        exchangeRate: rate.rate,
        fee,
        paymentMethod,
        purpose,
        notes,
        reference: generateReference(),
        status: 'pending'
      });

      // Process payment asynchronously
      paymentProcessor.processTransfer(transfer.id).catch(err => {
        logger.error('Payment processing error:', err);
      });

      logger.info(`Transfer created: ${transfer.id}`, { userId, amount: sourceAmount });

      res.status(201).json({
        success: true,
        data: transfer
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransfers(req, res, next) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, status } = req.query;
      const offset = (page - 1) * limit;

      const where = { userId };
      if (status) where.status = status;

      const { count, rows } = await Transfer.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        include: [{
          model: Beneficiary,
          as: 'beneficiary',
          attributes: ['id', 'firstName', 'lastName', 'country']
        }]
      });

      res.json({
        success: true,
        data: {
          transfers: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransferById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const transfer = await Transfer.findOne({
        where: { id, userId },
        include: [{
          model: Beneficiary,
          as: 'beneficiary'
        }]
      });

      if (!transfer) {
        return res.status(404).json({
          error: 'Transfer not found'
        });
      }

      res.json({
        success: true,
        data: transfer
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransferReceipt(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const transfer = await Transfer.findOne({
        where: { id, userId },
        include: [{
          model: Beneficiary,
          as: 'beneficiary'
        }]
      });

      if (!transfer) {
        return res.status(404).json({
          error: 'Transfer not found'
        });
      }

      const receipt = {
        transferId: transfer.id,
        reference: transfer.reference,
        status: transfer.status,
        date: transfer.createdAt,
        amount: {
          source: `${transfer.sourceAmount} ${transfer.sourceCurrency}`,
          destination: `${transfer.destinationAmount} ${transfer.destinationCurrency}`,
          exchangeRate: transfer.exchangeRate,
          fee: `${transfer.fee} ${transfer.sourceCurrency}`
        },
        beneficiary: {
          name: `${transfer.beneficiary.firstName} ${transfer.beneficiary.lastName}`,
          country: transfer.beneficiary.country,
          accountNumber: transfer.beneficiary.accountNumber
        }
      };

      res.json({
        success: true,
        data: receipt
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelTransfer(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const transfer = await Transfer.findOne({
        where: { id, userId }
      });

      if (!transfer) {
        return res.status(404).json({
          error: 'Transfer not found'
        });
      }

      if (!['pending', 'processing'].includes(transfer.status)) {
        return res.status(400).json({
          error: 'Transfer cannot be cancelled in current status'
        });
      }

      transfer.status = 'cancelled';
      await transfer.save();

      logger.info(`Transfer cancelled: ${transfer.id}`, { userId });

      res.json({
        success: true,
        message: 'Transfer cancelled successfully',
        data: transfer
      });
    } catch (error) {
      next(error);
    }
  }

  async getQuote(req, res, next) {
    try {
      const { amount, sourceCurrency, destinationCurrency } = req.body;

      const rate = await exchangeService.getRate(sourceCurrency, destinationCurrency);
      const destinationAmount = (amount * rate.rate).toFixed(2);
      const fee = await exchangeService.calculateFee(amount, sourceCurrency);
      const totalCost = (parseFloat(amount) + parseFloat(fee)).toFixed(2);

      res.json({
        success: true,
        data: {
          sourceAmount: amount,
          sourceCurrency,
          destinationAmount,
          destinationCurrency,
          exchangeRate: rate.rate,
          fee,
          totalCost,
          rateExpiry: rate.expiry
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

// Setup associations
Transfer.belongsTo(Beneficiary, { foreignKey: 'beneficiaryId', as: 'beneficiary' });

module.exports = new TransferController();