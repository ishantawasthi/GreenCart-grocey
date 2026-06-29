

//Add addresss : /api/address/add

import Address from "../../models/Address.js";

export const addAddress = async (req, res) => { 
  try {
 const userId = req.userId; // ✅

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
    const userId = req.userId; // ✅ from token

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

// Update address: /api/address/update/:id
export const updateAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const address = await Address.findOneAndUpdate(
      { _id: id, userId }, // ✅ ensures user apna hi address edit kare
      { ...req.body },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, message: "Address updated successfully", address });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete address: /api/address/delete/:id
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const address = await Address.findOneAndDelete({ _id: id, userId });

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};