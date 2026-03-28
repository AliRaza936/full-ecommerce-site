"use client";

import Image from "next/image";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ChevronUp,
} from "lucide-react";

import logo from "@/assets/Brand/logo-colored.svg";
import usFlag from "@/assets/flag/us.png";
import appstore from "@/assets/appple.png";
import playstore from "@/assets/play.png";

export default function Footer() {
  return (
    <>
    <footer className="w-full bg-white shadow p-5 py-10">

      {/* TOP SECTION */}
      <div className="max-w-300 mx-auto ">
        <div className="flex flex-col lg:flex-row  gap-15">

          {/* LEFT BRAND */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <Image src={logo} alt="Brand" className="lg:w-42 w-30" />
             
            </div>

            <p className="text-gray-600 text- leading-6 mb-5">
              Best information about the company gives here.
            </p>

            <div className="flex gap-4 text-gray-400">
              <Facebook size={18} />
              <Twitter size={18} />
              <Linkedin size={18} />
              <Instagram size={18} />
              <Youtube size={18} />
            </div>
          </div>

          {/* LINK COLUMNS */}
          <div className="flex flex-wrap justify-between gap-16">

            <FooterColumn
              title="About"
              links={["About Us", "Find store", "Categories", "Blogs"]}
            />

            <FooterColumn
              title="Partnership"
              links={["About Us", "Find store", "Categories", "Blogs"]}
            />

            <FooterColumn
              title="Information"
              links={[
                "Help Center",
                "Money Refund",
                "Shipping",
                "Contact us",
              ]}
            />

            <FooterColumn
              title="For users"
              links={["Login", "Register", "Settings", "My Orders"]}
            />

            {/* GET APP */}
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Get app</h4>
              <div className="flex flex-col gap-3">
                <div className="flex bg-black p-2 gap-1 items-center rounded-md">
                    <Image
                  src={appstore }
                  alt="App Store"
                  className="w-6 h-6 text-white"
                />
                <div className="text-white leading-3">
                    <span className="text-[9px] text-gray-400 leading">Download on the</span>
                <p className="mb-1">App Store</p>
                </div>
                </div>
                <div className="flex bg-black p-2 gap-1 items-center rounded-md">
                    <Image
                  src={playstore }
                  alt="play store"
                  className="w-6 h-6 text-white"
                />
                <div className="text-white leading-3">
                    <span className="text-[9px] text-gray-400 leading">Get it on</span>
                <p className="mb-1">Google Play</p>
                </div>
                </div>
                
                
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
     

    </footer>
     <div className="w-full bg-[#eaeaea] border-t border-gray-200">
        <div className="px-6 lg:px-16 py-8 flex justify-between items-center text-sm text-gray-600">
          <span>© 2026 Ecommerce.</span>

          <div className="flex items-center gap-2 ">
            <Image
              src={usFlag}
              alt="English"
              width={20}
              height={14}
              className=""
            />
            <span>English</span>
            <ChevronUp size={14} />
          </div>
        </div>
      </div>
    </>
    
    
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-gray-800">{title}</h4>
      <ul className="space-y-2 text-sm text-gray-600">
        {links.map((link, i) => (
          <li key={i} className="cursor-pointer hover:text-gray-900 text-[16px]  text-gray-500">
            {link}
          </li>
        ))}
      </ul>
    </div>
  );
}