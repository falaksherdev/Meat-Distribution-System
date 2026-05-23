"use client";

import {
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function StatsCards({ stats }) {
  // Proper rounding function
  const formatNumber = (num) => {
    if (typeof num !== "number") return num;
    // Round to 2 decimal places properly
    return Math.round(num * 100) / 100;
  };

  const formatValue = (value, unit = "") => {
    if (typeof value !== "number") return value;
    const rounded = formatNumber(value);
    // Agar decimal hai toh 2 digits dikhao, nahi toh integer
    const formatted =
      rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
    return formatted + unit;
  };

  const cards = [
    {
      title: "Total Ghost",
      value: formatValue(stats.totalGhost, " KG"),
      icon: CurrencyDollarIcon,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Distributed",
      value: formatValue(stats.distributed, " KG"),
      icon: CheckCircleIcon,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Remaining",
      value: formatValue(stats.remaining, " KG"),
      icon: ClockIcon,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      title: "Total Recipients",
      value: stats.totalRecipients,
      icon: UsersIcon,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircleIcon,
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: ClockIcon,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.bgColor} p-2 rounded-lg`}>
                <Icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
              <span className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">{card.title}</p>
          </div>
        );
      })}
    </div>
  );
}
