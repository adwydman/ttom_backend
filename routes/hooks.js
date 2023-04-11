const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  if (isNonSecurePath(req.path)) {
    return next();
  }
  const userToken = extractUserToken(req);
  if (!userToken) {
    return res.status(401).json({ message: 'User token not provided' });
  }

  const user = await User.findOne({ token: userToken });
  if (!user) {
    return res.status(404).json({ message: 'User token not found' });
  }

  req.__user__ = user;
  next();
}

const isNonSecurePath = (path) => {
  const nonSecurePaths = ['/', '/login', '/register', '/upload'];
  return nonSecurePaths.includes(path);
};

const extractUserToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7); // Remove "Bearer " from the start of the string
};

module.exports = {
  authenticateUser
}
