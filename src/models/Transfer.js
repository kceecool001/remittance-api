const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transfer = sequelize.define('Transfer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  beneficiaryId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'beneficiary_id'
  },
  sourceAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'source_amount'
  },
  sourceCurrency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD',
    field: 'source_currency'
  },
  destinationAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'destination_amount'
  },
  destinationCurrency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: 'destination_currency'
  },
  exchangeRate: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false,
    field: 'exchange_rate'
  },
  fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'payment_method'
  },
  reference: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  externalReference: {
    type: DataTypes.STRING(100),
    field: 'external_reference'
  },
  purpose: {
    type: DataTypes.STRING(200)
  },
  notes: {
    type: DataTypes.TEXT
  },
  failureReason: {
    type: DataTypes.TEXT,
    field: 'failure_reason'
  },
  completedAt: {
    type: DataTypes.DATE,
    field: 'completed_at'
  }
}, {
  tableName: 'transfers',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['beneficiary_id'] },
    { fields: ['status'] },
    { fields: ['reference'], unique: true },
    { fields: ['created_at'] }
  ]
});

module.exports = Transfer;