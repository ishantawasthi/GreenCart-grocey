import jwt from 'jsonwebtoken';

const authSeller = (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No token provided",
    });
  }

  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET); // ✅ use sellerToken

    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      return next(); // ✅ authorized seller
    } else {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error - Invalid token",
      error: error.message,
    });
  }
};

export default authSeller;
