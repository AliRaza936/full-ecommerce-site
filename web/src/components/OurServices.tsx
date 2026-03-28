"use client";

import React from "react";
import Image from "next/image";
import {
  Truck,
  ShieldCheck,
  Headphones,
  RefreshCcw,
  Search,
  Box,
  ShoppingBag,
  Send,
  SendHorizonal,
} from "lucide-react";

import s1 from "@/assets/s1.png";
import s2 from "@/assets/s2.png";
import s3 from "@/assets/s3.png";
import s4 from "@/assets/s4.png";

const services = [
  { id: 1, img: s1, title: "Source From Industry Hubs", icon: Search },
  { id: 2, img: s2, title: "Customize Your Products", icon: Box },
  { id: 3, img: s3, title: "Fast, Reliable shiping by ocean or air", icon: SendHorizonal },
  { id: 4, img: s4, title: "Product monitoring and inspection", icon: ShieldCheck },
];

const OurServices = () => {
  return (
    <div className="max-w-300 mx-auto mt-12 p-3 xl:p-0">
      
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-6">
        Our Services
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.id}
              className="relative bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer h-48"
            >
              {/* Top Image Section */}
              <div className="relative h-[65%] w-full">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>

              {/* Bottom White Section */}
              <div className="h-[40%] bg-white p-4 flex items-center">
                <p className="font-medium text-gray-800 w-[80%]">
                  {service.title}
                </p>
              </div>

              {/* Dynamic Icon */}
              <div className="absolute right-4 top-[65%] -translate-y-1/2 bg-white border border-gray-200 over p-0.5 rounded-full w-14  h-14 shadow-md">
                {/* <Icon size={36} className="text-gray-700" />
                 */}
                <div className="bg-green-200/60 w-full h-full flex items-center justify-center rounded-full">
                      <Icon size={22} className="text-gray-700" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OurServices;