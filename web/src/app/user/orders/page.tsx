"use client";

import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";

export default function UserOrdersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/user/order");
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  const getStatusInfo = (orderStatus: string) => {
    switch (orderStatus) {
      case "pending": return { icon: <Clock size={16} />, color: "text-yellow-600 bg-yellow-100 border-yellow-200", label: "Pending" };
      case "shipped": return { icon: <Truck size={16} />, color: "text-blue-600 bg-blue-100 border-blue-200", label: "Shipped" };
      case "delivered": return { icon: <CheckCircle size={16} />, color: "text-green-600 bg-green-100 border-green-200", label: "Delivered" };
      case "completed": return { icon: <Package size={16} />, color: "text-gray-600 bg-gray-100 border-gray-200", label: "Completed" };
      case "cancelled": return { icon: <XCircle size={16} />, color: "text-red-600 bg-red-100 border-red-200", label: "Cancelled" };
      default: return { icon: <Clock size={16} />, color: "text-gray-600 bg-gray-100 border-gray-200", label: "Unknown" };
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="max-w-300 mx-auto lg:px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 px-4 lg:px-0 text-gray-800">My Orders</h1>

        <div className="px-4 lg:px-0 space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-medium text-gray-700 mb-2">No orders found</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
              <button onClick={() => router.push("/")} className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded hover:bg-blue-700">Start Shopping</button>
            </div>
          ) : (
            orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              
              return (
                <div key={order._id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Order Placed</p>
                      <p className="font-semibold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total</p>
                      <p className="font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium sm:text-right">Order #</p>
                      <p className="font-mono text-sm font-semibold text-gray-800">{order._id}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                       <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit uppercase tracking-wider ${statusInfo.color}`}>
                         {statusInfo.icon} {statusInfo.label}
                       </span>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item: any) => (
                        <div key={item.productId} className="flex gap-4 items-center">
                          <div className="w-20 h-20 bg-gray-50 rounded border border-gray-100 p-2 flex-shrink-0">
                            <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                               <p className="font-medium text-gray-800 line-clamp-2">{item.name}</p>
                               <p className="text-sm text-gray-500 mt-1">Qty: {item.qty}</p>
                            </div>
                            <p className="font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
