"use client";

import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderPlacedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-gray-100 p-8 text-center mt-[-40px]">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="animate-bounce" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 mb-6 font-medium">Thank you for your purchase.</p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Your Order ID is:</p>
              <p className="font-mono text-lg font-semibold text-blue-600">{orderId}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/user/orders" className="flex-1 bg-white border-2 border-blue-600 text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2">
              <Package size={18} /> View Orders
            </Link>
            <Link href="/" className="flex-1 flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Go to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
