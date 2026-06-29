import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
  const { axios, user, products } = useAppContext(); // ✅ add products
  const [myorders, setMyOrders] = useState([]);

  const fetchOrders = async () => {

    if (!user) return;
      console.log("Fetching orders for user:", user._id); // 🔥 add
    try {
      const { data } = await axios.get(`/api/order/user/${user._id}`);
       console.log("Orders data:", data); // 🔥 add
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <div>
      <div className='flex flex-col items-end w-max mb-8'>
        <p className='text-2xl font-medium uppercase'>My Orders</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {myorders.length === 0 && (
        <p className="text-gray-500">No orders placed yet.</p>
      )}

      {myorders.map((order, index) => (
        <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>
          <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
            <span>OrderId: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total Amount: ₹{order.totalAmount}</span>
          </p>

          {order.items.map((item, idx) => {
            // ✅ look up product from dummyProducts using string id
            const product = products.find(p => p._id === item.productId);
            if (!product) return null;

            return (
              <div
                key={idx}
                className={`relative bg-white text-gray-500/70 
                  ${order.items.length !== idx + 1 ? "border-b" : ""} 
                  border-gray-300 flex flex-col md:flex-row md:items-center justify-between 
                  p-4 py-5 md:gap-16 w-full max-w-4xl`}
              >
                <div className='flex items-center mb-4 md:mb-0'>
                  <div className='bg-primary/10 p-4 rounded-lg'>
                    <img
                      src={Array.isArray(product.image) ? product.image[0] : product.image}
                      alt={product.name}
                      className='w-16 h-16'
                    />
                  </div>
                  <div className='ml-4'>
                    <h2 className='text-xl font-medium text-gray-800'>{product.name}</h2>
                    <p>Category: {product.category}</p>
                  </div>
                </div>

                <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                  <p>Quantity: {item.quantity || 1}</p>
                  <p>Status: {order.status}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className='text-primary text-lg font-medium'>
                    Amount: ₹{(product.offerPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;