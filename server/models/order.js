import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId,
           ref: "Product",
         required: true },
         
        quantity: { type: Number, required: true },
      },
    ],

    totalAmount: { type: Number, required: true },

    address: { type: String, required: true },

    status: { type: String, default: "Order Placed" }, // Pending, Shipped, Delivered
    paymentType: { type: String, required: true }, // COD, Online
    isPaid: { type: Boolean, default: false }, // Default false
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
