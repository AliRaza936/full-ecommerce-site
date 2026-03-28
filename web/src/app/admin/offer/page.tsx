"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Search, Loader2, Tag, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function OfferPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state: any) => state.user);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/offer");
      if (data.success) {
        setOffers(data.offers);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (userData?.role !== "admin") {
      toast.error("Dummy Admins cannot delete offers.");
      return;
    }
    const confirm = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirm) return;

    try {
      const { data } = await axios.delete(`/api/admin/offer/${id}`);
      if (data.success) {
        toast.success("Offer deleted");
        setOffers(offers.filter((o) => o._id !== id));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete offer");
    }
  };

  const isLive = (offer: any) => {
    const now = new Date();
    return offer.isActive && new Date(offer.startDate) <= now && new Date(offer.endDate) >= now;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Offers & Deals</h1>
          <p className="text-slate-500 mt-1">Manage time-limited promotional offers for your store.</p>
        </div>

        {userData?.role === "admin" ? (
          <Link href="/admin/offer/create">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-sm w-full sm:w-auto">
              <Plus size={20} />
              Add Offer
            </button>
          </Link>
        ) : (
          <button
            onClick={() => toast.error("Dummy Admins cannot add offers.")}
            className="bg-slate-300 text-slate-500 cursor-not-allowed px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-sm w-full sm:w-auto"
          >
            <Plus size={20} />
            Add Offer (Admin Only)
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search offers..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Offer</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Start</th>
                <th className="px-6 py-4">End</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading offers...
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Tag className="w-6 h-6 text-slate-300" />
                    </div>
                    No offers found. Start by creating one!
                  </td>
                </tr>
              ) : (
                offers.map((offer) => {
                  const live = isLive(offer);
                  const ended = new Date(offer.endDate) < new Date();
                  const notStarted = new Date(offer.startDate) > new Date();

                  let statusLabel = "Inactive";
                  let statusClass = "bg-slate-100 text-slate-500";
                  if (!offer.isActive) {
                    statusLabel = "Disabled";
                    statusClass = "bg-slate-100 text-slate-500";
                  } else if (live) {
                    statusLabel = "Live";
                    statusClass = "bg-green-100 text-green-700";
                  } else if (ended) {
                    statusLabel = "Ended";
                    statusClass = "bg-red-100 text-red-600";
                  } else if (notStarted) {
                    statusLabel = "Scheduled";
                    statusClass = "bg-yellow-100 text-yellow-700";
                  }

                  return (
                    <tr key={offer._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{offer.title}</div>
                        {offer.description && (
                          <div className="text-slate-400 text-xs mt-0.5 truncate max-w-[200px]">
                            {offer.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-blue-600">{offer.discountPercentage}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {offer.products.slice(0, 3).map((prod: any) => (
                            <div
                              key={prod._id}
                              className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 overflow-hidden"
                              title={prod.name}
                            >
                              {prod.images?.[0] ? (
                                <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400">
                                  {prod.name[0]}
                                </div>
                              )}
                            </div>
                          ))}
                          {offer.products.length > 3 && (
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[9px] text-slate-500 font-medium">
                              +{offer.products.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 mt-1 block">{offer.products.length} product(s)</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(offer.startDate)}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(offer.endDate)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link href={`/admin/offer/create?id=${offer._id}`}>
                          <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <Edit2 size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(offer._id, offer.title)}
                          className={`p-2 transition-colors rounded-lg ${
                            userData?.role === "admin"
                              ? "text-red-600 bg-red-50 hover:bg-red-100"
                              : "text-slate-400 bg-slate-100 cursor-not-allowed"
                          }`}
                          title={userData?.role === "admin" ? "Delete" : "Disabled for Dummy Admin"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500 bg-slate-50">
          <span>Showing {offers.length} offers</span>
        </div>
      </div>
    </div>
  );
}
