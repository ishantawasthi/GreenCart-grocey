import { v2 as cloudinary } from "cloudinary";
import Product from "../../models/product.js";


export const addProduct = async (req, res) => {
  try {
    const images = req.files || [];

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: "Images required" });
    }

    const imagesURL = await Promise.all(
      images.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await Product.create({ // ✅ capital P
      name: req.body.name,
      description: JSON.parse(req.body.description || "[]"),
      price: Number(req.body.price),
      offerPrice: Number(req.body.offerPrice), // ✅ lowercase p
      category: req.body.category,
      inStock: true,
      image: imagesURL
    });

    res.json({ success: true, message: "Product added successfully" });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
  //Get product : /api/product/list
  export const ProductList = async (req, res) => {
       try {
          const products = await product.find({});
          res.json({ success: true, products });

       } catch (error) {
          console.log(error);
          res.status(500).json({ success: false, message: "Internal Server Error" }); 

       }
  }

  
  //Get single  product : /api/product/id
  export const ProductById = async (req, res) => {
  try {
    const { id } = req.params;   // ✅ params, not body
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


    //Get   product inStock : /api/product/stock
 export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const updatedProduct = await product.findByIdAndUpdate(
      id,
      { inStock: inStock },
      { new: true }
    );

    res.json({
      success: true,
      message: "Stock updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};