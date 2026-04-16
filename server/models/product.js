

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  description: { type: String, required: true },
    price: { type: Number, required: true },
     Offerprice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    inStock: { type: Boolean, required: true },
    
  },
  {timestamps: true, versionKey: false} // Disable versionKey
);
const Product =  mongoose.model("Product", ProductSchema);

export default Product;
