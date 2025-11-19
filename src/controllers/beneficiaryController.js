exports.createBeneficiary = async (req, res) => {
  res.json({ message: 'createBeneficiary — not implemented yet' });
};

exports.getBeneficiaries = async (req, res) => {
  res.json({ message: 'getBeneficiaries — not implemented yet' });
};

exports.getBeneficiaryById = async (req, res) => {
  res.json({ message: `getBeneficiaryById — ${req.params.id}` });
};

exports.updateBeneficiary = async (req, res) => {
  res.json({ message: `updateBeneficiary — ${req.params.id}` });
};

exports.deleteBeneficiary = async (req, res) => {
  res.json({ message: `deleteBeneficiary — ${req.params.id}` });
};
