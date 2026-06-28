import User from "../../models/User.js";


export const updateCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅ fixed
    const { cartItems } = req.body;

    if (!cartItems || typeof cartItems !== "object") { // ✅ fixed
      return res.status(400).json({
        success: false,
        message: "Invalid cart data",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cartItems },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Cart updated successfully",
      cartItems: updatedUser.cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: error.message,
    });
  }
};