"use client";

import { useState, useEffect } from "react";
import {
  HomeIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  CurrencyDollarIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: HomeIcon },
    { id: "totalghost", name: "Total Ghost Manager", icon: CurrencyDollarIcon },
    { id: "options", name: "Options Manager", icon: Cog6ToothIcon },
    { id: "reports", name: "Reports", icon: ChartBarIcon },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-700 text-white p-2 rounded-lg shadow-lg"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative z-50 w-72 bg-gradient-to-b from-green-900 to-green-800 text-white flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ height: windowHeight || "100vh" }}
      >
        {/* Close Button for Mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white p-1"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Logo Section - Fixed at top */}
        <div className="p-4 h-20  border-b border-green-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">M</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Meet Manager</h2>
              <p className="text-xs text-green-300">Ghost Distribution</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable if content overflows */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  activeTab === item.id
                    ? "bg-yellow-500 text-green-900"
                    : "hover:bg-green-700"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-4 border-t border-green-700 flex-shrink-0">
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-all text-red-300 hover:text-white"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium truncate">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
