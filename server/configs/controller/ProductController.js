


import product from "../../models/product.js";



// Add Product : /api/product/add
  export const addProduct = async (req, res) => {   
try {
       let productData =JSON.parse(req.body.product);

       const image = req.files

       let imagesURL=await Promise.all(
        image.map(async (img) => {  
          return await cloudinary.uploader.upload(img.path, {
            resource_type: "image",
          });
        }      ));


     await product.create({
        ...productData,image: imagesURL.map((img) => img.secure_url)
      });

      res.json({success :true, message : "Product added successfully"});


} catch (error) {
  console.log(error);
  res.status(500).json({ success: false, message: "Internal Server Error" }); 
}
  }

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
            const { id, inStock } = req.body
       await product.findByIdAndUpdate(id,{inStock})
       res.json({ success: true, message: "Stock updated successfully" });  

   } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    
   }
  }