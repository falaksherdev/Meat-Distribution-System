"use client";

import {
  HomeIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: HomeIcon },
    { id: "totalghost", name: "Total Ghost Manager", icon: CurrencyDollarIcon },
    { id: "options", name: "Options Manager", icon: Cog6ToothIcon },
    { id: "reports", name: "Reports", icon: ChartBarIcon },
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-green-900 to-green-800 text-white flex flex-col">
      <div className="p-6 border-b border-green-700">
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

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                activeTab === item.id
                  ? "bg-yellow-500 text-green-900"
                  : "hover:bg-green-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-green-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-all text-red-300 hover:text-white"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
