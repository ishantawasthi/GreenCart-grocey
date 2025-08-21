// server/configs/controller/sellerController.js
import jwt from "jsonwebtoken";

// ---------------- SELLER LOGIN ----------------
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate credentials
    if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: false, // set true in production with HTTPS
        sameSite: "lax",
      });

      return res.json({
        success: true,
        message: "Seller login successful",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error - Login failed",
      error: error.message,
    });
  }
};

// ---------------- IS SELLER AUTH ----------------
export const isSellerAuth = (req, res) => {
  // If authSeller middleware passed, seller is valid
  return res.json({
    success: true,
    message: "Seller is authenticated",
  });
};

// ---------------- SELLER LOGOUT ----------------
export const sellerlogout = (req, res) => {
  res.clearCookie("sellerToken");
  return res.json({
    success: true,
    message: "Seller logged out successfully",
  });
};
