import Product from "../../models/product.js";
import Order from "../../models/order.js";
import Razorpay from "razorpay";



export const placeOrderRazorpay = async (req, res) => {


const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,

});


  try {
    const { userId, orderDetails } = req.body;

    if (!orderDetails || !orderDetails.items) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    let totalAmount = 0;

    for (const item of orderDetails.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      totalAmount += product.price * item.quantity;
    }

    totalAmount += Math.floor(totalAmount * 0.02);

    // 🔥 Create Razorpay order
    const options = {
      amount: (totalAmount * 100)/100, // paisa
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save order in DB
    const newOrder = await Order.create({
      userId,
      items: orderDetails.items,
      totalAmount,
      address: orderDetails.address,
      paymentType: "ONLINE",
      isPaid: false,
    });

    res.json({
      success: true,
      order: razorpayOrder,
      dbOrderId: newOrder._id,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating Razorpay order",
    });
  }
};


export const verifyRazorpay = async (req, res) => {
  try {


    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID missing",
      });
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Payment successful",
      order: updated,
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error); // 🔥 IMPORTANT
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Place order with Cash on Delivery

export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ from token
    const { items, address } = req.body;

    if (!items || !address) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      totalAmount += product.price * item.quantity;
    }

    // 2% tax
    totalAmount += Math.floor(totalAmount * 0.02);

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
    console.log(error); // 🔥 always log
    res.status(500).json({
      success: false,
      message: error.message,
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
