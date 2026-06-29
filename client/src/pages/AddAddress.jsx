import React, { useState } from "react";
import assets from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const AddAddress = () => {
  const { axios, navigate, fetchAddress } = useAppContext();
  const location = useLocation();
  const editingAddress = location.state?.address || null; // ✅ if editing, this exists

  const [formData, setFormData] = useState(
    editingAddress
      ? {
          firstName: editingAddress.firstName,
          lastName: editingAddress.lastName,
          email: editingAddress.email,
          phone: editingAddress.phone,
          street: editingAddress.street,
          city: editingAddress.city,
          state: editingAddress.state,
          pincode: editingAddress.pincode,
          country: editingAddress.country,
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
        }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (editingAddress) {
        const res = await axios.put(`/api/address/update/${editingAddress._id}`, formData);
        data = res.data;
      } else {
        const res = await axios.post("/api/address/add", formData);
        data = res.data;
      }

      if (data.success) {
        toast.success(editingAddress ? "Address Updated!" : "Address Saved!");
        await fetchAddress();
        navigate("/cart");
      } else {
        toast.error(data.message || "Failed to save address");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving address");
    }
  };

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-bold font-normal gap-2 flex align-items-start">
        {editingAddress ? "Edit Shipping" : "Add Shipping"}{" "}
        <span className="font-semibold text-primary">Address</span>
      </p>

      <div className="flex flex-col-reverse md:flex-row justify-between mt-10 items-center md:items-start gap-10">
        <div className="flex-1 max-w-md w-full">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required
                className="w-full px-3 py-2.5 border border-gray-400 rounded outline-none text-gray-700 font-normal focus:border-primary transition" />
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required
                className="w-full px-3 py-2.5 border border-gray-400 rounded outline-none text-gray-700 font-normal focus:border-primary transition" />
            </div>

            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required
              className="w-full px-3 py-2.5 border border-gray-400 rounded outline-none text-gray-700 font-normal focus:border-primary transition" />

            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required
              className="w-full px-3 py-2.5 border border-gray-400 rounded outline-none text-gray-700 font-normal focus:border-primary transition" />

            <input type="text" name="street" placeholder="Street Address" value={formData.street} onChange={handleChange} required
              className="w-full px-3 py-2.5 border border-gray-400 rounded outline-none text-gray-700 font-normal focus:border-primary transition" />

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required
                className="w-full px-3 py-2.5 border border-gray-400 rounded outline-none text-gray-700 font-normal focus:border-primary transition" />
              <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required
                className="w-full px-3 py-2.5 border border-gray-400 rounded outline-none text-gray-700 font-normal focus:border-primary transition" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required
                className="w-full px-3 py-2.5 border border-gray-400 rounded outline-none text-gray-700 font-normal focus:border-primary transition" />
              <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required
                className="w-full px-3 py-2.5 border border-gray-400 rounded outline-none text-gray-700 font-normal focus:border-primary transition" />
            </div>

            <button type="submit" className="w-full py-3 mt-4 bg-primary text-white rounded hover:bg-primary/90 transition">
              {editingAddress ? "Update Address" : "Save Address"}
            </button>
          </form>
        </div>

        <div className="md:w-1/2 w-full flex justify-center">
          <img className="w-[80%] md:w-[70%] lg:w-[60%] object-contain" src={assets.add_address_iamge} alt="Add Address" />
        </div>
      </div>
    </div>
  );
};

export default AddAddress;