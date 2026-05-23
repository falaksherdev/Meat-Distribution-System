"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function AddRecipientForm({ options, onAdd, year }) {
  const [formData, setFormData] = useState({
    name: "",
    amount_grams: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.amount_grams) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await onAdd({
        name: formData.name,
        amount_grams: parseInt(formData.amount_grams),
        year: year,
      });
      setFormData({ name: "", amount_grams: "" });
      toast.success("Recipient added successfully");
    } catch (error) {
      toast.error("Failed to add recipient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <PlusIcon className="w-5 h-5 text-green-600" />
        Add New Recipient
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Person Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <select
          value={formData.amount_grams}
          onChange={(e) =>
            setFormData({ ...formData, amount_grams: e.target.value })
          }
          className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="">Select Amount</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.value_grams}>
              {opt.name} ({opt.value_grams}g)
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Recipient"}
        </button>
      </form>
    </div>
  );
}
