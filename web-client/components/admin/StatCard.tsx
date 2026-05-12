import React from "react";

export interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}


export const StatsCard: React.FC<StatCard> = React.memo(({ label, value, icon }) => {
  return (
    <div className="rounded-xl p-6 bg-white  border border-gray-200  shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="p-3 rounded-lg bg-gray-100 ">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 ">
            {label}
          </p>
          <p className="text-2xl font-bold mt-2 text-gray-900 ">
            {value}
          </p>
        </div>

      </div>
    </div>
  );
});


StatsCard.displayName = "StatsCard";