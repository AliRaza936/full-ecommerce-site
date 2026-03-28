"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import { clearCart } from "@/redux/cartSlice";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const { userData } = useSelector((state: any) => state.user);
  const { items, totalAmount } = useSelector((state: any) => state.cart);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !isOrderPlaced) {
      router.push("/user/cart");
    }
  }, [items, router, isOrderPlaced]);

  useEffect(() => {
    if (userData) {
      setShippingInfo((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
      }));
    }
  }, [userData]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.postalCode || !shippingInfo.country) {
      toast.error("Please fill all shipping details");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/user/order", { shippingInfo });
      if (res.data.success) {
        setIsOrderPlaced(true);
        dispatch(clearCart());
        toast.success("Order placed successfully!");
        router.push(`/user/order-placed?orderId=${res.data.order._id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || items.length === 0) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-300 mx-auto lg:px-4 py-8">
        <div className="flex items-center gap-2 mb-6 px-4 lg:px-0">
          <Link href="/user/cart" className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm font-medium">
            <ArrowLeft size={16} /> Back to Cart
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6 px-4 lg:px-0 text-gray-800">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-0">
          {/* Shipping Form */}
          <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-100">Shipping Information</h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 123 Main St, Apt 4B"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. New York"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. NY"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. United States"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 10001"
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-md font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 flex justify-center items-center h-12"
              >
                {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-4">
                {items.map((item: any) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded border border-gray-100 p-1 flex-shrink-0">
                      <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{item.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">Qty: {item.qty}</span>
                        <span className="text-sm font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
