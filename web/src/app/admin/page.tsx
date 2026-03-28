"use client";

import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, Package, DollarSign, Loader2, ArrowUpRight, TrendingUp } from "lucide-react";
import axios from "axios";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/stats");
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setTopProducts(data.topProducts);
      }
    } catch (error) {
      console.error("Error fetching stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statsConfig = [
    { 
      title: "Total Revenue", 
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "$0", 
      icon: <DollarSign size={24} className="text-emerald-500" />, 
      trend: "+2.1% from today",
      bgColor: "bg-emerald-50"
    },
    { 
      title: "Total Users", 
      value: stats ? stats.totalUsers.toLocaleString() : "0", 
      icon: <Users size={24} className="text-blue-500" />, 
      trend: "Recent platform growth",
      bgColor: "bg-blue-50"
    },
    { 
      title: "Total Orders", 
      value: stats ? stats.totalOrders.toLocaleString() : "0", 
      icon: <ShoppingBag size={24} className="text-indigo-500" />, 
      trend: "Order volume tracking",
      bgColor: "bg-indigo-50"
    },
    { 
      title: "Total Products", 
      value: stats ? stats.totalProducts.toLocaleString() : "0", 
      icon: <Package size={24} className="text-orange-500" />, 
      trend: "Inventory overview",
      bgColor: "bg-orange-50"
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Real-time performance metrics and store management.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Live Updates Active
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`p-3 w-fit rounded-xl ${stat.bgColor} mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-1">{stat.value}</h3>
            <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">{stat.title}</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-left">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900">Recent Transactions</h2>
            <Link href="/admin/orders" className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium whitespace-nowrap">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-400 font-mono">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-black">
                          {order.userId?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-sm text-slate-800">{order.userId?.name || "Guest"}</span>
                          <span className="text-xs text-slate-400 truncate max-w-[120px]">{order.userId?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">${order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                        order.status === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No recent transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden text-left">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900">Top Products</h2>
            <Link href="/admin/product" className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1">
              Store <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {topProducts.map((prod) => (
              <div key={prod._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-2 relative">
                  <img src={prod.images?.[0]} alt="" className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{prod.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{prod.catSlug}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">${prod.price}</p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">In Stock</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
                <div className="h-64 flex items-center justify-center text-slate-400 italic font-medium">No products listed.</div>
            )}
          </div>
          <div className="mt-auto p-6 bg-slate-50/50 border-t border-slate-100">
            <div className="flex justify-between items-center text-sm font-bold text-slate-600">
              <span>Inventory Health</span>
              <span className="text-emerald-500 underline">Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
