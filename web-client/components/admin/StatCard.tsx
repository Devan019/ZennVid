import React from "react";

export interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}


export const StatsCard: React.FC<StatCard> = React.memo(({ label, value, icon }) => {
  return (
    <div className="rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </p>
          <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        
      </div>
    </div>
  );
});