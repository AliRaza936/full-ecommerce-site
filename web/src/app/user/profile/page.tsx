"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { User, Mail, Phone, Camera, Loader2, Save } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { userData } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setMobile(userData.mobile || "");
    }
  }, [userData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", mobile);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.put("/api/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUserData(res.data.user));
        setImageFile(null); // Clear file after successful upload
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 px-6 py-8 sm:p-10 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pattern-boxes" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path fill="currentColor" d="M0 0h40v40H0z" />
                  <path fill="#ffffff" d="M0 0h20v20H0zM20 20h20v20H20z" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-boxes)" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white relative z-10">My Profile</h2>
          <p className="mt-2 text-blue-100 relative z-10">Update your personal information</p>
        </div>

        <form onSubmit={handleUpdateProfile} className="px-6 py-8 sm:p-10">
          <div className="flex flex-col md:flex-row gap-10">
            
            {/* Left Column - Avatar */}
            <div className="flex flex-col items-center space-y-4 md:w-1/3">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 shadow-md flex items-center justify-center bg-blue-100 text-blue-600 text-4xl font-bold">
                  {preview ? (
                    <Image src={preview} alt="Preview" width={128} height={128} className="w-full h-full object-cover" />
                  ) : userData?.image ? (
                    <Image src={userData.image} alt="User" width={128} height={128} className="w-full h-full object-cover" />
                  ) : (
                    <span>{userData.email?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                
                <label htmlFor="image-upload" className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-white text-xs font-medium">Change</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 font-medium">{userData.role.toUpperCase()}</p>
            </div>

            {/* Right Column - Form Fields */}
            <div className="flex-1 space-y-6">
              
              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={userData.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Your Full Name"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter Mobile Number"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-between sm:justify-end items-center gap-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
                    loading || !name.trim() ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
