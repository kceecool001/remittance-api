const crypto = require('crypto');

const generateReference = () => {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TXN${timestamp}${random}`.toUpperCase();
};

const maskAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length < 4) return accountNumber;
  const lastFour = accountNumber.slice(-4);
  const masked = '*'.repeat(accountNumber.length - 4);
  return masked + lastFour;
};

const calculateTransactionHash = (transfer) => {
  const data = `${transfer.id}${transfer.sourceAmount}${transfer.destinationAmount}${transfer.reference}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = {
  generateReference,
  maskAccountNumber,
  calculateTransactionHash
};