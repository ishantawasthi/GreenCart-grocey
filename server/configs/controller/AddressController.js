

//Add addresss : /api/address/add

import Address from "../../models/Address.js";

export const addAddress = async (req, res) => { 
  try {
    const userId = req.user.id; // 🔥 from token

    const address = await Address.create({
      userId,
      ...req.body   // ✅ direct body use
    });

    res.json({
      success: true,
      message: "Address added successfully",
      address
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


/// get address : /api/address/get

export const getAddress = async (req, res) => { 
  try {
    const userId = req.user.id; // ✅ from token

    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses });

  } catch (error) {
    console.log("ERROR:", error); // 🔥 print actual error
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};