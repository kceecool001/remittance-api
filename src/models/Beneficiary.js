const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Beneficiary = sequelize.define('Beneficiary', {
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
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'last_name'
  },
  email: {
    type: DataTypes.STRING(255),
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  country: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  bankName: {
    type: DataTypes.STRING(200),
    field: 'bank_name'
  },
  accountNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'account_number'
  },
  routingNumber: {
    type: DataTypes.STRING(50),
    field: 'routing_number'
  },
  swiftCode: {
    type: DataTypes.STRING(11),
    field: 'swift_code'
  },
  iban: {
    type: DataTypes.STRING(34)
  },
  accountType: {
    type: DataTypes.ENUM('checking', 'savings'),
    defaultValue: 'checking',
    field: 'account_type'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  }
}, {
  tableName: 'beneficiaries',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['user_id', 'is_active'] }
  ]
});

module.exports = Beneficiary;