import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './db.js'; // Keep extension .js in ESM
import dotenv from 'dotenv';

dotenv.config();


import userRouter from './Routes/userRoute.js';
import sellerRouter from './Routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import ProductRouter from './Routes/ProductRoute.js';
import cartRouter from './Routes/cartRoute.js';
import addressRouter from './Routes/AddressRoute.js';
import orderRouter from './Routes/orderRoute.js';



const app = express();   // ✅ You missed this
const PORT = process.env.PORT || 3000;  // ✅ Declare PORT (use .env or fallback)



// Define allowed origins
const allowedOrigins = ['http://localhost:5173'];

// Connect to MongoDB + Cloudinary
connectDB();
connectCloudinary();


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Test Route
app.get('/', (req, res) => res.send('API is running'));

// Routes
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', ProductRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order',orderRouter);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
