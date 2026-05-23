"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function OptionsManager({ options, onOptionsChange }) {
  const [newOption, setNewOption] = useState({ name: "", value_grams: "" });
  const [loading, setLoading] = useState(false);

  const addOption = async (e) => {
    e.preventDefault();

    if (!newOption.name || !newOption.value_grams) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOption),
      });

      if (response.ok) {
        toast.success("Option added successfully");
        setNewOption({ name: "", value_grams: "" });
        onOptionsChange();
      } else {
        toast.error("Failed to add option");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteOption = async (id) => {
    if (confirm("Are you sure you want to delete this option?")) {
      try {
        const response = await fetch(`/api/options?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Option deleted");
          onOptionsChange();
        } else {
          toast.error("Failed to delete option");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <PlusIcon className="w-5 h-5 text-green-600" />
          Add New Distribution Option
        </h3>

        <form onSubmit={addOption} className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Option Name (e.g., 1.5 KG)"
            value={newOption.name}
            onChange={(e) =>
              setNewOption({ ...newOption, name: e.target.value })
            }
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="number"
            placeholder="Value in Grams"
            value={newOption.value_grams}
            onChange={(e) =>
              setNewOption({ ...newOption, value_grams: e.target.value })
            }
            className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Option"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Available Options
          </h3>
        </div>

        {options.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No options available. Add some above.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {options.map((option) => (
              <div
                key={option.id}
                className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{option.name}</p>
                  <p className="text-sm text-gray-500">
                    {option.value_grams} grams
                  </p>
                </div>
                <button
                  onClick={() => deleteOption(option.id)}
                  className="text-red-600 hover:text-red-800 transition-colors p-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
