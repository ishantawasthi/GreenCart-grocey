import { v2 as cloudinary } from "cloudinary";
import Product from "../../models/product.js";



export const addProduct = async (req, res) => {
  try {
    // Force override any cached config
    
const imagesURL = await Promise.all(
  images.map(async (img) => {
    console.log("Uploading:", {
      name: img.originalname,
      size: img.size,
      type: img.mimetype,
      hasBuffer: !!img.buffer,
    });

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
        },
        (error, result) => {
          console.log("CLOUDINARY RESULT:", result);
          console.log("CLOUDINARY ERROR:", error);

          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

      stream.end(img.buffer);
    });
  })
);
} catch (error) {
  console.error("FULL ERROR:", error);
  console.error("ERROR JSON:", JSON.stringify(error, null, 2));

  return res.status(500).json({
    success: false,
    message: error.message,
    http_code: error.http_code,
    error,
  });
}
};

export const ProductList = async (req, res) => {
  try {
    const products = await Product.find({}); // ✅ Capital P
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const ProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Product ID required" });
    }
    const updatedProduct = await Product.findByIdAndUpdate( // ✅ Capital P
      id,
      { inStock },
      { new: true }
    );
    res.json({ success: true, message: "Stock updated", product: updatedProduct });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};