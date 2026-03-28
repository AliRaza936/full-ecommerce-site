"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useSelector((state: any) => state.user);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/category");
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (userData?.role !== "admin") {
      toast.error("Dummy Admins cannot delete categories.");
      return;
    }
    const confirm = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirm) return;

    try {
      const { data } = await axios.delete(`/api/admin/category/${id}`);
      if (data.success) {
        toast.success("Category deleted");
        setCategories(categories.filter((c) => c._id !== id));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Categories</h1>
          <p className="text-slate-500 mt-1">Manage all product categories in your store.</p>
        </div>
        
        {userData?.role === "admin" ? (
           <Link href="/admin/category/create">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-sm w-full sm:w-auto">
              <Plus size={20} />
              Add Category
            </button>
          </Link>
        ) : (
          <button onClick={() => toast.error("Dummy Admins cannot add categories.")} className="bg-slate-300 text-slate-500 cursor-not-allowed px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-sm w-full sm:w-auto">
            <Plus size={20} />
            Add Category (Admin Only)
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-slate-300" />
                    </div>
                    No categories found. Start by adding one!
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{cat.title}</td>
                    <td className="px-6 py-4 text-slate-500">/{cat.slug}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(cat.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                       {/* Editing/Deleting uses Role-checks inside logic or visually disables them */}
                      <Link href={`/admin/category/create?id=${cat._id}`}>
                        <button 
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(cat._id, cat.title)}
                        className={`p-2 transition-colors rounded-lg ${userData?.role === 'admin' ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-slate-400 bg-slate-100 cursor-not-allowed'}`}
                        title={userData?.role === 'admin' ? "Delete" : "Disabled for Dummy Admin"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple Footer/Pagination anchor */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500 bg-slate-50">
          <span>Showing {categories.length} entries</span>
        </div>
      </div>
    </div>
  );
}
