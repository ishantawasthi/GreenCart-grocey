

//Add addresss : /api/address/add

import Address from "../../models/Address.js";

export const addAddress = async (req, res) => { 

try {
    const { address ,userId } = req.body;
   await Address.create({
      ...address, userId});
      res.json({success :true, message : "Address added successfully"});    

} catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });                 
}

}



/// get address : /api/address/get

export const getAddress = async (req, res) => { 
    try {
        const { userId } = req.body; // safer than req.body.userId
        const addresses = await Address.find({ userId });   
           res.json({ success: true, addresses });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" }); 
        
    }
}