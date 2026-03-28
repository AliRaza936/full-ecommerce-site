"use client";

import React from "react";
import Image from "next/image";

/* Dummy flags — replace later */
import flag1 from "@/assets/flag/uae.png";
import flag2 from "@/assets/flag/autralia.png";
import flag3 from "@/assets/flag/us.png";
import flag4 from "@/assets/flag/ru.png";
import flag5 from "@/assets/flag/it.png";
import flag6 from "@/assets/flag/dk.png";
import flag7 from "@/assets/flag/fr.png";
import flag8 from "@/assets/flag/grmerny.png";
import flag9 from "@/assets/flag/china.png";
import flag10 from "@/assets/flag/uk.png";



const suppliers = [
  { id: 1, name: "Arabic Emirates", site: "shopname.ae", flag: flag1 },
  { id: 2, name: "Australia", site: "shopname.ae", flag: flag2 },
  { id: 3, name: "United States", site: "shopname.ae", flag: flag3 },
  { id: 4, name: "Russia", site: "shopname.ru", flag: flag4 },
  { id: 5, name: "Italy", site: "shopname.it", flag: flag5 },
  { id: 6, name: "Denmark", site: "denmark.com.dk", flag: flag6 },
  { id: 7, name: "France", site: "shopname.com.fr", flag: flag7 },
  { id: 8, name: "Germany", site: "shopname.gb", flag: flag8 },
  { id: 9, name: "China", site: "shopname.ae", flag: flag9 },
  { id: 10, name: "Great Britain", site: "shopname.co.uk", flag: flag10 },
];

const SuppliersByRegion = () => {
  return (
    <div className="max-w-300 mx-auto mt-10 p-3 xl:p-0">
      <h2 className="text-2xl font-semibold mb-6">
        Suppliers by region
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-3 gap-x-10">
        {suppliers.map((item) => (
          <div key={item.id} className="flex items-center gap-3 ">
            
            <Image
              src={item.flag}
              alt={item.name}
              width={28}
              height={20}
              className=" object-cover"
            />

            <div>
              <p className="font-medium text-gray-800">
                {item.name}
              </p>
              <p className="text-sm text-gray-400">
                {item.site}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SuppliersByRegion;