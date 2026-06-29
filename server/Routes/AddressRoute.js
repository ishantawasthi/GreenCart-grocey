 

 import express from 'express';

import authUser from '../middlewares/authUser.js';
import { addAddress ,getAddress,updateAddress,deleteAddress} from '../configs/controller/AddressController.js';


 const addressRouter = express.Router();

addressRouter.post('/add',authUser,addAddress);

addressRouter.get('/get',authUser, getAddress);


addressRouter.put('/update/:id', authUser, updateAddress);     // ✅ new
addressRouter.delete('/delete/:id', authUser, deleteAddress);  // ✅ new


export default addressRouter;