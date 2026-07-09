import { v2 as cloudinary } from "cloudinary";
import Product from "../../models/product.js";


export const addProduct = async (req, res) => {
  try {
    // Cloudinary config initialize karo
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const files = req.files; // Kyuki upload.array use kiya hai, files milega
 
    console.log("FILES RECEIVED:", files);

    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No images uploaded. Make sure key name is 'images'" 
      });
    }

    // Ek array banao uploaded URLs store karne ke liye
    const imageUrls = [];

    // Saari images ko loop karke Cloudinary pe upload karo (using your preset)
    for (const file of files) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "image", upload_preset: "greencart" ,cloud_name: "kyj5bmed"},
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        ).end(file.buffer);
      });
      imageUrls.push(result);
    }

    // 🚀 Success Response
    return res.json({
      success: true,
      message: "Images uploaded successfully!",
      images: imageUrls // Saare uploaded image links mil jayenge
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};

export const ProductList = async (req, res) => {
  try {
    const products = await Product.find({}); // ✅ Capital P
    console.log("🔍 TOTAL PRODUCTS IN DB:", products.length); // ADD THIS
    
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