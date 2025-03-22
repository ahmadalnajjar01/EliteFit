const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // ✅ دعم التوكن من `cookies` أو `Authorization` header

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = authMiddleware;
