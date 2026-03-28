"use client"

import { useState } from "react"
import background from "@/assets/inquery.png"
import InquiryForm from "@/components/InquiryForm"

export default function InquerySection() {

  const [showModal, setShowModal] = useState(false)

  return (
    <section className="relative w-full lg:h-105 h-64 overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center -scale-x-100"
        style={{ backgroundImage: `url(${background.src})` }}
      />

      <div className="absolute inset-0 bg-linear-to-r from-blue-700/95 via-blue-600/90 to-cyan-500/80" />

      <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center justify-between px-10">

        <div className="max-w-lg text-white">

          <h1 className="lg:text-4xl text-3xl font-semibold">
            An easy way to send <br /> requests to all suppliers
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="mt-7 flex lg:hidden bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Send inquiry
          </button>

          <p className="mt-4 hidden lg:block text-white/90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

        </div>

        {/* Desktop form */}
        <div className="hidden lg:flex w-105">
          <InquiryForm />
        </div>

      </div>

      {/* Mobile modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

          <div className="w-11/12 max-w-md relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute right-3 top-3 text-gray-600"
            >
              ✕
            </button>

            <InquiryForm onClose={() => setShowModal(false)} />

          </div>

        </div>
      )}

    </section>
  )
}