"use client"

import { useState } from "react"

export default function InquiryForm({ onClose }: { onClose?: () => void }) {

  const [form, setForm] = useState({
    item: "What item you need?",
    details: "",
    quantity: "",
    unit: "Pcs"
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form)

    if (onClose) onClose()
  }

  return (
    <div className="bg-gray-100 rounded-xl shadow-lg p-6">

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Send quote to suppliers
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="item"
          readOnly
          value={form.item}
          onChange={handleChange}
          className="w-full px-4 py-2 outline-none rounded-md border border-gray-300 bg-white"
        />

        <textarea
          name="details"
          placeholder="Type more details"
          value={form.details}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 outline-none rounded-md border border-gray-300 bg-white resize-none"
        />

        <div className="flex gap-3">

          <div className="flex w-[60%] items-center px-2 rounded-md border border-gray-300 bg-white">
            <span className="text-sm">Quantity</span>

            <input
              type="number"
              name="quantity"
              placeholder="eg:2"
              value={form.quantity}
              onChange={handleChange}
              className="px-4 py-2 w-full outline-none"
            />
          </div>

          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-28 px-3 py-2 rounded-md border outline-none border-gray-300 bg-white"
          >
            <option>Pcs</option>
            <option>Kg</option>
            <option>Box</option>
          </select>

        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition w-full"
        >
          Send inquiry
        </button>

      </form>

    </div>
  )
}