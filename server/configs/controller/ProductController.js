import { v2 as cloudinary } from "cloudinary";
import Product from "../../models/product.js";



export const addProduct = async (req, res) => {
  try {
    // Force override any cached config
    



    const images = req.files || [];
    if (images.length === 0) {
      return res.status(400).json({ success: false, message: "Images required" });
    }

    const imagesURL = await Promise.all(
      images.map((img) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          ).end(img.buffer);
        })
      )
    );

    await Product.create({
      name: req.body.name,
      description: JSON.parse(req.body.description || "[]"),
      price: Number(req.body.price),
      offerPrice: Number(req.body.offerPrice),
      category: req.body.category,
      inStock: true,
      image: imagesURL,
    });

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
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