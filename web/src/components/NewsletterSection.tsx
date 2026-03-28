"use client";

import React from "react";
import { Mail } from "lucide-react";

const NewsletterSection = () => {
  return (
    <div className="mt-16 bg-gray-100 py-14">
      <div className="w-full mx-auto text-center px-4">
        
        <h2 className="text-2xl font-semibold">
          Subscribe on our newsletter
        </h2>

        <p className="text-gray-500 mt-2">
          Get daily news on upcoming offers from many suppliers all over the world
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          
          <div className="relative w-full sm:w-80">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-md font-medium">
            Subscribe
          </button>

        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;