import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }

    req.userId = decoded.id; // ✅ attach userId to request
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Token expired or invalid",
    });
  }
};

export default authUser;
