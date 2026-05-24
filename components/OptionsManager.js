"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function OptionsManager({ options, onOptionsChange }) {
  const [newOption, setNewOption] = useState({ name: "", value_grams: "" });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    setDeletingId(id);
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
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Add New Option Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <PlusIcon className="w-5 h-5 text-green-600" />
          Add New Distribution Option
        </h3>

        <form onSubmit={addOption} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Option Name (e.g., 1.5 KG)"
            value={newOption.name}
            onChange={(e) =>
              setNewOption({ ...newOption, name: e.target.value })
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={loading}
            required
          />

          <input
            type="number"
            placeholder="Value in Grams"
            value={newOption.value_grams}
            onChange={(e) =>
              setNewOption({ ...newOption, value_grams: e.target.value })
            }
            className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </>
            ) : (
              "Add Option"
            )}
          </button>
        </form>
      </div>

      {/* Options List */}
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
                className="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{option.name}</p>
                  <p className="text-sm text-gray-500">
                    {option.value_grams} grams
                  </p>
                </div>
                <button
                  onClick={() => deleteOption(option.id)}
                  disabled={deletingId === option.id}
                  className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-700 hover:to-rose-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
                >
                  {deletingId === option.id ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
