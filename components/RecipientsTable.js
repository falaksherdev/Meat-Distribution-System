"use client";

import { useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function RecipientsTable({
  recipients,
  onUpdateStatus,
  onDelete,
}) {
  const [loadingId, setLoadingId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  const handleUpdateStatus = async (id, status) => {
    setLoadingId(id);
    setLoadingAction(status);
    try {
      await onUpdateStatus(id, status);
    } finally {
      setLoadingId(null);
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this recipient?")) {
      setLoadingId(id);
      setLoadingAction("delete");
      try {
        await onDelete(id);
      } finally {
        setLoadingId(null);
        setLoadingAction(null);
      }
    }
  };

  const getStatusBadge = (status) => {
    if (status === "confirmed") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3" />
          Confirmed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <XCircleIcon className="w-3 h-3" />
        Pending
      </span>
    );
  };

  if (recipients.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-500">No recipients added yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recipients.map((recipient) => {
              const isLoading = loadingId === recipient.id;
              const isConfirmLoading =
                isLoading && loadingAction === "confirmed";
              const isUndoLoading = isLoading && loadingAction === "pending";
              const isDeleteLoading = isLoading && loadingAction === "delete";

              return (
                <tr
                  key={recipient.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {recipient.name}
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-gray-700">{recipient.amount_grams}g</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {getStatusBadge(recipient.status)}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-sm text-gray-500">
                      {new Date(recipient.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {recipient.status === "pending" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(recipient.id, "confirmed")
                          }
                          disabled={isLoading}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-4 w-32 cursor-pointer justify-center py-1.5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isConfirmLoading ? (
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
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              Confirm
                            </>
                          )}
                        </button>
                      )}
                      {recipient.status === "confirmed" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(recipient.id, "pending")
                          }
                          disabled={isLoading}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 sm:px-4 w-32 cursor-pointer justify-center py-1.5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:from-yellow-600 hover:to-orange-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isUndoLoading ? (
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
                              Processing...
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              Undo
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(recipient.id)}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 sm:px-4 w-32 cursor-pointer justify-center py-1.5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:from-red-700 hover:to-rose-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isDeleteLoading ? (
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
                            <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />{" "}
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
