const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      service: 'remittance-api'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

router.get('/ready', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).send('OK');
  } catch (error) {
    res.status(503).send('Not Ready');
  }
});

router.get('/live', (req, res) => {
  res.status(200).send('OK');
});

module.exports = router;