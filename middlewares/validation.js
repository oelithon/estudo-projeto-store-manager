const valueRequired = (req, res, next) => {
  const { name, quantity } = req.body;

  if (!name) {
    res.status(400).json({ message: '"name" is required' });
    return;
  }
  if (!quantity && quantity !== 0) {
    res.status(400).json({ message: '"quantity" is required' });
    return;
  }
  next();
};

const inputRequirements = (req, res, next) => {
  const { name, quantity } = req.body;

  if (name.length < 5) {
    res.status(422).json({ message: '"name" length must be at least 5 characters long' });
    return;
  }

  if (quantity !== Number || quantity < 1) {
    res.status(422).json({ message: '"quantity" must be a number larger than or equal to 1' });
    return;
  }
  next();
};

module.exports = {
  valueRequired,
  inputRequirements,
};
