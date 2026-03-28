'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import ofimg5 from "@/assets/Image/tech/3.jpg";
import ofimg4 from "@/assets/Image/tech/5.jpg";
import ofimg3 from "@/assets/Image/tech/6.jpg";
import ofimg2 from "@/assets/Image/tech/7.jpg";
import ofimg1 from "@/assets/Image/tech/8.jpg";
import { ArrowLeft, Lock, LockKeyhole, MessageSquare, Truck } from 'lucide-react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { setCart } from '../redux/cartSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';


const CartPage = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { items, totalAmount } = useSelector((state: any) => state.cart);
  console.log(items);
  const [loadingConfig, setLoadingConfig] = useState(false);


  const handleQtyChange = (productId: string, qty: number) => {
    // Optimistic local update via Redux would be tricky without an action for just one item, 
    // so let's do local clone then dispatch entire cart
    const newItems = items.map((item: any) => item.productId === productId ? { ...item, qty } : item);
    const newTotal = newItems.reduce((acc: number, item: any) => acc + item.price * item.qty, 0);
    dispatch(setCart({ items: newItems, totalAmount: newTotal }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoadingConfig(true);
      const res = await axios.put("/api/user/cart", { items });
      if (res.data.success) {
        toast.success("Cart updated successfully");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating cart");
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      setLoadingConfig(true);
      const res = await axios.delete(`/api/user/cart?itemId=${productId}`);
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Item removed");
      }
    } catch (error: any) {
      toast.error("Error removing item");
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleRemoveAll = async () => {
    try {
      setLoadingConfig(true);
      const res = await axios.delete(`/api/user/cart?all=true`);
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Cart cleared");
      }
    } catch (error: any) {
      toast.error("Error clearing cart");
    } finally {
      setLoadingConfig(false);
    }
  };

  const subtotal = totalAmount || 0;
  const discount = items.length > 0 ? 60 : 0; // sample
  const tax = items.length > 0 ? 14 : 0; // sample
  const total = items.length > 0 ? subtotal - discount + tax : 0;

  return (
    <div className="max-w-300 mx-auto lg:px-4 py-6">
      <h2 className="text-xl font-semibold mb-4 px-4 lg:px-0 ">My cart ({items.length})</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          <div className="lg:p-4  border bg-white border-gray-200 rounded-md  gap-4 relative">
            {loadingConfig && (
              <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-md">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {items.length === 0 ? (
              <div className="py-16 px-4 text-center border border-gray-100 rounded-lg bg-gray-50/50 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is feeling lonely</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">Discover amazing products and fill it up with items you love!</p>
                <Link href="/">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-sm hover:bg-blue-700 shadow-md transition hover:-translate-y-0.5 active:translate-y-0">
                    Start Shopping
                  </button>
                </Link>
              </div>
            ) : items.map((item: any) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row border-b border-gray-200 p-4 gap-4"
              >
                {/* Left Section */}
                <div className="flex gap-4 flex-1">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={0}
                    className="rounded object-contain "
                  />

                  <div className="flex flex-col">
                    <h3 className="font-medium text-sm sm:text-base">
                      {item.name}
                    </h3>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="text-red-500 text-xs sm:text-sm border border-gray-200 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Remove
                      </button>

                      <button className="text-blue-500 text-xs sm:text-sm border border-gray-200 px-2 py-1 rounded">
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">

                  {/* Price */}
                  <span className="font-semibold text-base">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>

                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded px-2 py-1">
                    <span className="text-sm mr-1">Qty</span>
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        handleQtyChange(item.productId, parseInt(e.target.value))
                      }
                      className="outline-none text-sm"
                    >
                      {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <div className='w-full justify-between flex items-center'>
              <Link href={'/'}>
                <button className="mt-4 px-2 lg:px-4 py-1.5 bg-gray-100 text-gray-700 font-medium rounded flex lg:gap-2 text-sm hover:bg-gray-200"><ArrowLeft className='mt-1' size={16} /> <span>Back to shop</span></button>
              </Link>
              {items.length > 0 && (
                <div className="flex gap-3 mt-2">
                  <button onClick={handleRemoveAll} className="text-red-500 border border-gray-200 px-4 font-medium py-1.5 rounded-md text-sm hover:bg-red-50">Remove all</button>
                  <button onClick={handleSaveChanges} disabled={loadingConfig} className="bg-blue-600 text-white px-4 font-medium py-1.5 rounded-md shadow text-sm hover:bg-blue-700 disabled:opacity-50">Save Changes</button>
                </div>
              )}
            </div>
          </div>



          <div className="flex flex-col md:flex-row justify-between mt-8 gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-3">
              <div className='bg-gray-300 p-3 rounded-full'>
                <LockKeyhole />
              </div>
              <div>
                <span className='text-lg font- text-black'>Secure payment</span>
                <p className='text-[15px] text-gray-500'>Have you ever finally just</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className='bg-gray-300 p-3 rounded-full'>
                <MessageSquare />
              </div>
              <div>
                <span className='text-lg font- text-black'>Customer support</span>
                <p className='text-[15px] text-gray-500'>Have you ever finally just</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className='bg-gray-300 p-3 rounded-full'>
                <Truck />
              </div>
              <div>
                <span className='text-lg  text-black'>Free Delivery</span>
                <p className='text-[15px] text-gray-500'>Have you ever finally just</p>
              </div>
            </div>


          </div>
        </div>

        {/* Summary */}
        <div className="w-full h-90 lg:w-80 p-4 border border-gray-200 rounded-md flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Have a coupon?</label>
            <div className="flex mt-1 gap-2">
              <input type="text" placeholder="Add coupon" className="flex-1 border border-gray-200 rounded px-2 py-1" />
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Apply</button>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-500">
              <span>Tax:</span>
              <span>+${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link href={items.length > 0 ? "/user/checkout" : "#"}>
            <button
              disabled={items.length === 0}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded text-lg disabled:opacity-50"
            >
              Checkout
            </button>
          </Link>
          <div className="flex justify-center gap-2 mt-2 text-xs text-gray-500">
            <span>Accepted: Visa, MasterCard, PayPal, Apple Pay</span>
          </div>
        </div>

      </div>

      {/* Info section */}

      <div className='mt-10 rounded-md bg-white border border-gray-200 p-4'>
        <h2 className='text-xl font-semibold'>Saved for later</h2>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5'>
          {items?.map((product:any) => (
            <ProductCard
              key={product.productId}
              id={product.productId}
              name={product.name}
              price={product.price}
              img={product.image}
              showCart={true}
            />
          ))}
        </div>
      </div>

      {/* banner */}
      <div className='bg-blue-600 rounded-md hidden lg:flex items-center text-white justify-between p-8 mt-5'>
        <div>
          <h2 className='text-2xl font-medium'>Super discount on more than 100 USD</h2>
          <p className='text-[16px] text-gray-300'>Have you ever finally just write dummy info</p>
        </div>
        <button className='bg-amber-500 text-white px-4 py-2 rounded-md'>Shop now</button>
      </div>
    </div>
  )
}

export default CartPage