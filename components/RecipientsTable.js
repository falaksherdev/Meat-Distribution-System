"use client";

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
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recipients.map((recipient) => (
              <tr
                key={recipient.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{recipient.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-700">{recipient.amount_grams}g</p>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(recipient.status)}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-500">
                    {new Date(recipient.created_at).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {recipient.status === "pending" && (
                      <button
                        onClick={() =>
                          onUpdateStatus(recipient.id, "confirmed")
                        }
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
                      >
                        <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                        Confirm
                      </button>
                    )}
                    {recipient.status === "confirmed" && (
                      <button
                        onClick={() => onUpdateStatus(recipient.id, "pending")}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-orange-600 transition-all shadow-sm hover:shadow-md"
                      >
                        <XCircleIcon className="w-4 h-4 inline mr-1" />
                        Undo
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(recipient.id)}
                      className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-red-700 hover:to-rose-700 transition-all shadow-sm hover:shadow-md"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
