"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/admin/order");
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await axios.put("/api/admin/order", { orderId, status: newStatus });
      
      if (res.data.success) {
        toast.success("Order status updated");
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
      fetchOrders(); // Revert back to original on error
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-none">Order Management</h2>
          <p className="text-sm text-slate-500 mt-1">View and update customer order statuses</p>
        </div>
        <button onClick={fetchOrders} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200 shadow-sm">
          Refresh Orders
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No orders found.</div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  <th scope="col" className="px-6 py-4 relative"><span className="sr-only">Expand</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                  <tr 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-slate-900">{order._id.substring(order._id.length - 8)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{order.shippingInfo?.name || order.userId?.name || "N/A"}</div>
                      <div className="text-xs text-slate-500">{order.shippingInfo?.email || order.userId?.email || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase tracking-wide ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className="mt-1 block w-full pl-3 pr-8 py-1.5 text-sm border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-slate-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {expandedOrderId === order._id ? (
                        <ChevronUp size={20} className="text-slate-400 inline-block" />
                      ) : (
                        <ChevronDown size={20} className="text-slate-400 inline-block" />
                      )}
                    </td>
                  </tr>
                  
                  {expandedOrderId === order._id && (
                    <tr className="bg-slate-50/30">
                      <td colSpan={7} className="px-8 py-6 border-b-2 border-slate-100">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 max-w-4xl">
                          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                            <Package className="text-blue-600" size={20} />
                            <h3 className="font-semibold text-slate-800 text-base">Order Items</h3>
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                              {order.items?.length || 0} items
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order.items?.map((item: any, i: number) => (
                              <div key={i} className="flex gap-4 p-3 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                                <img 
                                  src={item.image || item.img || "/placeholder.png"} 
                                  alt={item.name} 
                                  className="w-16 h-16 rounded-md object-cover border border-slate-200 shadow-sm"
                                />
                                <div className="flex flex-col justify-center flex-1 min-w-0">
                                  <span className="text-sm font-medium text-slate-800 truncate" title={item.name}>
                                    {item.name}
                                  </span>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-slate-500 font-medium">Qty: {item.qty}</span>
                                    <span className="text-sm font-semibold text-slate-700">
                                      ${(item.price * item.qty).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Shipping Details snippet */}
                          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shipping Address</h4>
                              <p className="text-sm text-slate-700">{order.shippingInfo?.address}</p>
                              <p className="text-sm text-slate-700">{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.postalCode}</p>
                              <p className="text-sm text-slate-700">{order.shippingInfo?.country}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Context</h4>
                              <p className="text-sm text-slate-700"><span className="text-slate-500 inline-block w-12">Name:</span> {order.shippingInfo?.name}</p>
                              <p className="text-sm text-slate-700"><span className="text-slate-500 inline-block w-12">Email:</span> {order.shippingInfo?.email}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
