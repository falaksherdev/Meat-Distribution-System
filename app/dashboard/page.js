"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import StatsCards from "../../components/StatsCards";
import AddRecipientForm from "../../components/AddRecipientForm";
import RecipientsTable from "../../components/RecipientsTable";
import OptionsManager from "../../components/OptionsManager";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalGhost, setTotalGhost] = useState(0);
  const [recipients, setRecipients] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [ghostYears, setGhostYears] = useState([]);
  const [selectedGhostYear, setSelectedGhostYear] = useState(2025);
  const [ghostAmount, setGhostAmount] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("meet_user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
      loadData();
      loadAllGhostYears();
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      loadRecipients();
      loadYearlySettings();
    }
  }, [selectedYear, user]);

  const loadData = async () => {
    await Promise.all([loadRecipients(), loadOptions(), loadYearlySettings()]);
    setLoading(false);
  };

  const loadRecipients = async () => {
    try {
      const response = await fetch(`/api/recipients?year=${selectedYear}`);
      const data = await response.json();
      setRecipients(data);
    } catch (error) {
      toast.error("Failed to load recipients");
    }
  };

  const loadOptions = async () => {
    try {
      const response = await fetch("/api/options");
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      toast.error("Failed to load options");
    }
  };

  const loadYearlySettings = async () => {
    try {
      const response = await fetch(`/api/settings?year=${selectedYear}`);
      const data = await response.json();
      if (data && data.total_ghost_kg !== undefined) {
        setTotalGhost(data.total_ghost_kg);
      } else {
        setTotalGhost(0);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      setTotalGhost(0);
    }
  };

  const loadAllGhostYears = async () => {
    try {
      const response = await fetch("/api/settings?all=true");
      const data = await response.json();
      if (Array.isArray(data)) {
        setGhostYears(data);
      }
    } catch (error) {
      console.error("Failed to load ghost years:", error);
    }
  };

  const saveYearlySettings = async (year, newTotal) => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: year, total_ghost_kg: newTotal }),
      });

      const data = await response.json();

      if (response.ok) {
        if (year === selectedYear) {
          setTotalGhost(newTotal);
        }
        toast.success(`Total ghost for ${year} saved to ${newTotal} KG`);
        loadAllGhostYears();
      } else {
        toast.error("Failed to save: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    }
  };

  const addGhostYear = () => {
    if (!selectedGhostYear || !ghostAmount) {
      toast.error("Please select year and enter amount");
      return;
    }
    saveYearlySettings(selectedGhostYear, parseFloat(ghostAmount));
    setGhostAmount("");
  };

  const addRecipient = async (recipientData) => {
    const response = await fetch("/api/recipients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipientData),
    });

    if (response.ok) {
      await loadRecipients();
      toast.success("Recipient added");
    } else {
      throw new Error("Failed to add");
    }
  };

  const updateStatus = async (id, status) => {
    const response = await fetch("/api/recipients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (response.ok) {
      await loadRecipients();
      toast.success("Status updated");
    }
  };

  const deleteRecipient = async (id) => {
    if (confirm("Are you sure you want to delete this recipient?")) {
      const response = await fetch(`/api/recipients?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadRecipients();
        toast.success("Recipient deleted");
      }
    }
  };

  const editRecipientAmount = async (id, newAmount) => {
    try {
      const response = await fetch("/api/recipients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, amount_grams: newAmount }),
      });

      if (response.ok) {
        await loadRecipients();
        toast.success("Amount updated");
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("meet_user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const formatNumber = (num) => {
    if (typeof num !== "number") return num;
    return Math.round(num * 100) / 100;
  };

  const filteredRecipients = recipients.filter((recipient) => {
    if (statusFilter === "all") return true;
    return recipient.status === statusFilter;
  });

  const stats = {
    totalGhost: totalGhost,
    distributed: formatNumber(
      recipients.reduce((sum, r) => sum + r.amount_grams / 1000, 0),
    ),
    remaining: formatNumber(
      totalGhost -
        recipients.reduce((sum, r) => sum + r.amount_grams / 1000, 0),
    ),
    totalRecipients: recipients.length,
    confirmed: recipients.filter((r) => r.status === "confirmed").length,
    pending: recipients.filter((r) => r.status === "pending").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-green-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-auto lg:ml-0">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-8 py-4 sm:h-20 h-auto  gap-3">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                {activeTab === "dashboard" && "Ghost Distribution"}
                {activeTab === "totalghost" && "Total Ghost Manager"}
                {activeTab === "options" && "Options Manager"}
                {activeTab === "reports" && "Reports & Analytics"}
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Welcome back, {user?.email}
              </p>
            </div>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {[
                2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033,
                2034, 2035,
              ].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <>
              <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-blue-600">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-blue-200 font-medium tracking-wide">
                      Total Ghost for {selectedYear}
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold text-white mt-2">
                      {totalGhost} KG
                    </p>
                    <p className="text-xs text-blue-300 mt-3">
                      {totalGhost === 0
                        ? '⚠️ Please add total ghost in "Total Ghost Manager" tab'
                        : "✓ Ready for distribution"}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <StatsCards stats={stats} />
              <AddRecipientForm
                options={options}
                onAdd={addRecipient}
                year={selectedYear}
              />

              {/* Mobile Filter Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4 mt-6">
                <span className="text-lg font-semibold text-gray-700">
                  Filter by status
                </span>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md ${
                      statusFilter === "all"
                        ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    All ({recipients.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("pending")}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md ${
                      statusFilter === "pending"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md"
                        : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
                    }`}
                  >
                    Pending (
                    {recipients.filter((r) => r.status === "pending").length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("confirmed")}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md ${
                      statusFilter === "confirmed"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                        : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                    }`}
                  >
                    Confirmed (
                    {recipients.filter((r) => r.status === "confirmed").length})
                  </button>
                </div>
              </div>

              <RecipientsTable
                recipients={filteredRecipients}
                onUpdateStatus={updateStatus}
                onDelete={deleteRecipient}
                onEditAmount={editRecipientAmount}
              />
            </>
          )}

          {/* TOTAL GHOST MANAGER TAB */}
          {activeTab === "totalghost" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Add / Update Total Ghost
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Year
                    </label>
                    <select
                      value={selectedGhostYear}
                      onChange={(e) =>
                        setSelectedGhostYear(parseInt(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {[
                        2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033,
                        2034, 2035,
                      ].map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Ghost (KG)
                    </label>
                    <input
                      type="number"
                      value={ghostAmount}
                      onChange={(e) => setGhostAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter total ghost"
                    />
                  </div>
                  <button
                    onClick={addGhostYear}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
                  >
                    Add / Update
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b bg-gray-50 overflow-x-auto">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Ghost Records
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Year
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Total Ghost (KG)
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Last Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {ghostYears.length === 0 ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 sm:px-6 py-8 text-center text-gray-500"
                          >
                            No records found.
                          </td>
                        </tr>
                      ) : (
                        ghostYears.map((item) => (
                          <tr key={item.year} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">
                              {item.year}
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <span className="font-semibold text-green-600">
                                {item.total_ghost_kg}
                              </span>{" "}
                              KG
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                              {new Date(item.updated_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* OPTIONS TAB */}
          {activeTab === "options" && (
            <OptionsManager options={options} onOptionsChange={loadOptions} />
          )}

          {/* REPORTS TAB */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      Distribution Report
                    </h2>
                    <p className="text-blue-100 text-xs sm:text-sm mt-1">
                      Year {selectedYear} | Qurbani Meat Distribution Summary
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-xl shadow-md p-3 sm:p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Total Ghost
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">
                        {stats.totalGhost}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          KG
                        </span>
                      </p>
                    </div>
                    <div className="bg-blue-100 rounded-xl p-2 sm:p-3">
                      <svg
                        className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-3 sm:p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Distributed
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">
                        {stats.distributed}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          KG
                        </span>
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-xl p-2 sm:p-3">
                      <svg
                        className="w-4 h-4 sm:w-6 sm:h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-3 sm:p-5 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Remaining
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">
                        {stats.remaining}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          KG
                        </span>
                      </p>
                    </div>
                    <div className="bg-yellow-100 rounded-xl p-2 sm:p-3">
                      <svg
                        className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-3 sm:p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Distribution Rate
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">
                        {stats.totalGhost > 0
                          ? (
                              (stats.distributed / stats.totalGhost) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                    <div className="bg-purple-100 rounded-xl p-2 sm:p-3">
                      <svg
                        className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                  <h3 className="font-semibold text-gray-800">
                    Distribution Progress
                  </h3>
                  <span className="text-sm text-gray-500">
                    {stats.totalGhost > 0
                      ? ((stats.distributed / stats.totalGhost) * 100).toFixed(
                          1,
                        )
                      : 0}
                    % Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalGhost > 0 ? (stats.distributed / stats.totalGhost) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4 border-b">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Detailed Summary
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">Total Recipients</span>
                        <span className="font-semibold text-gray-800 text-lg">
                          {stats.totalRecipients}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">
                          Confirmed Deliveries
                        </span>
                        <span className="font-semibold text-green-600 text-lg">
                          {stats.confirmed}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">
                          Pending Deliveries
                        </span>
                        <span className="font-semibold text-yellow-600 text-lg">
                          {stats.pending}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">
                          Average per Person
                        </span>
                        <span className="font-semibold text-gray-800 text-lg">
                          {(
                            stats.distributed / stats.totalRecipients || 0
                          ).toFixed(2)}{" "}
                          KG
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">Total Distributed</span>
                        <span className="font-semibold text-green-600 text-lg">
                          {stats.distributed} KG
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-gray-600">
                          Left to Distribute
                        </span>
                        <span className="font-semibold text-yellow-600 text-lg">
                          {stats.remaining} KG
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-600 rounded-full p-2">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">
                      Distribution efficiency:{" "}
                      <strong className="text-green-700">
                        {stats.totalGhost > 0
                          ? (
                              (stats.distributed / stats.totalGhost) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 rounded-full p-2">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">
                      Last updated:{" "}
                      <strong>{new Date().toLocaleDateString()}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
