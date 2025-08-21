import express from 'express';
import { sellerLogin ,isSellerAuth,sellerlogout} from '../configs/controller/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login',sellerLogin);
sellerRouter.get('/is-auth',authSeller,isSellerAuth);
sellerRouter.get('/logout', sellerlogout);

export default sellerRouter; // Exporting the sellerRouter to be used in server.js  
