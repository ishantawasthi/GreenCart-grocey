import Product from "../../models/product.js";
import Order from "../../models/order.js";

// Place COD Order
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, orderDetails } = req.body;

    if (!userId || !orderDetails || !orderDetails.items || !orderDetails.address) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid order data" 
      });
    }

    const { items, address } = orderDetails;
    let totalAmount = 0;

    // Calculate total
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product not found: ${item.productId}` 
        });
      }
      totalAmount += product.price * item.quantity;
    }

    // Add 2% tax
    totalAmount += Math.floor(totalAmount * 0.02);

    // Save order
    await Order.create({
      userId,
      items,
      totalAmount,
      address,
      paymentType: "COD",
      isPaid: false,
    });

    res.json({
      success: true,
      message: "Order placed successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
  }
};

// Get orders by userId
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
      message: "Orders retrieved successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving orders",
      error: error.message,
    });
  }
};

// Get all orders (for seller/admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
      message: "All orders retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving all orders",
      error: error.message,
    });
  }
};
