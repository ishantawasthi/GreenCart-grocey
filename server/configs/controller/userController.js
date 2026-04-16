
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// =================== REGISTER ===================
export const register = async (req, res) => {
   console.log("REGISTER ROUTE HIT");
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      cartItems: {},
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      user: { email: newUser.email, name: newUser.name, id: newUser._id },
      message: "User registered successfully",
    });

  } catch (error) {
    return res.json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

// =================== LOGIN ===================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name, id: user._id },
      message: "User logged in successfully",
    });

  } catch (error) {
    return res.json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// =================== IS AUTH ===================
export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // ✅ use req.userId

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user,
      message: "User is authenticated",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error checking authentication",
      error: error.message,
    });
  }
};


// =================== LOGOUT ===================
export const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    return res.json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
};
