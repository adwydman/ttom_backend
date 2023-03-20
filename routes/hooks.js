const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  const nonSecurePaths = ['/', '/login', '/register', '/upload'];
  if (nonSecurePaths.includes(req.path)) {
    return next();
  }

  const userToken = req.body.userToken || req.query.userToken;

  const user = await User.findOne({ token: userToken });
  if (!user) {
    return res.status(404).json({ message: 'User token not found' });
  }

  req.__user__ = user;

  next();
}

module.exports = {
  authenticateUser
}
