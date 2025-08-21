import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, ProductList, ProductById, changeStock } from '../configs/controller/ProductController.js';

const ProductRouter = express.Router();

ProductRouter.post('/add', upload.array("images"), authSeller, addProduct);

ProductRouter.get('/list', ProductList);

ProductRouter.get('/:id', ProductById);

ProductRouter.post('/stock', authSeller, changeStock);

export default ProductRouter;