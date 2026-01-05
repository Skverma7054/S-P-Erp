import { useState } from "react";
import { TrendingUp, TrendingDown, SlidersHorizontal } from "lucide-react";

const TimeFilterTabs = ({ value, onChange }) => {
  const tabs = ["weekly", "monthly", "yearly"];

  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      {tabs.map((tab) => {
        const active = value === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`text-sm w-full rounded-md px-3 py-2 font-medium transition
              ${
                active
                  ? "bg-white text-gray-900 shadow-theme-xs dark:bg-gray-800 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        );
      })}
    </div>
  );
};

const StatItem = ({ label, value, percentage }) => {
  const isPositive = percentage >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="px-6 py-5">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>

      <div className="mt-2 flex items-end gap-3">
        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
          {value}
        </h4>

        <span
          className={`flex items-center gap-1 rounded-full py-0.5 px-2 text-sm font-medium
            ${
              isPositive
                ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-500"
                : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-500"
            }`}
        >
          <Icon className="size-4" />
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export const OverViewStatsCard = ({ stats }) => {
  const [range, setRange] = useState("weekly");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Vendor Information
        </h3>

        <div className="flex gap-x-3.5">
          <TimeFilterTabs value={range} onChange={setRange} />

          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <SlidersHorizontal className="size-5" />
            <span className="hidden sm:block">Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800 dark:bg-gray-900">
        {stats.map((item, index) => (
          <div
            key={item.id ?? index}
            className={`border-gray-200 dark:border-gray-800
              ${
                index < stats.length - 1
                  ? "border-b sm:border-r xl:border-b-0"
                  : ""
              }`}
          >
            <StatItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};
