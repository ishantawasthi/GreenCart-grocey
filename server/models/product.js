

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: Array, required: true, unique: true },
    price: { type: Number, required: true },
     Offerprice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    inStock: { type: Boolean, required: true },
    
  },
  {timestamps: true, versionKey: false} // Disable versionKey
);

// ✅ Always capitalize model names ("User")
const product = mongoose.models.User || mongoose.model("product", productSchema);

export default product;
