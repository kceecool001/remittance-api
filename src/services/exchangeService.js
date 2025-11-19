const axios = require('axios');
const logger = require('../utils/logger');

class ExchangeService {
  constructor() {
    this.baseURL = process.env.EXCHANGE_API_URL || 'https://api.exchangerate-api.com/v4/latest';
    this.cache = new Map();
    this.cacheDuration = 3600000; // 1 hour
  }

  async getRate(fromCurrency, toCurrency) {
    const cacheKey = `${fromCurrency}_${toCurrency}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    try {
      // In production, use a real exchange rate API
      // This is a mock implementation
      const response = await axios.get(`${this.baseURL}/${fromCurrency}`);
      const rate = response.data.rates[toCurrency];

      if (!rate) {
        throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
      }

      const result = {
        rate,
        fromCurrency,
        toCurrency,
        expiry: new Date(Date.now() + this.cacheDuration).toISOString()
      };

      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      logger.info(`Exchange rate fetched: ${fromCurrency} to ${toCurrency} = ${rate}`);
      return result;

    } catch (error) {
      logger.error('Exchange rate fetch error:', error);
      
      // Fallback to mock rates if API fails
      const mockRates = {
        'USD_EUR': 0.92,
        'USD_GBP': 0.79,
        'USD_INR': 83.12,
        'USD_NGN': 1550.00,
        'EUR_USD': 1.09,
        'GBP_USD': 1.27
      };

      const mockRate = mockRates[`${fromCurrency}_${toCurrency}`] || 1.0;
      
      return {
        rate: mockRate,
        fromCurrency,
        toCurrency,
        expiry: new Date(Date.now() + 300000).toISOString() // 5 min for fallback
      };
    }
  }

  async calculateFee(amount, currency) {
    // Fee calculation logic - customize based on your business model
    const feePercentage = 0.02; // 2%
    const minFee = currency === 'USD' ? 1.00 : 100; // Minimum fee
    const maxFee = currency === 'USD' ? 50.00 : 5000; // Maximum fee

    let fee = amount * feePercentage;
    fee = Math.max(fee, minFee);
    fee = Math.min(fee, maxFee);

    return parseFloat(fee.toFixed(2));
  }
}

module.exports = new ExchangeService();