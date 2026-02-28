"use client"

import { MonthlyRevenue } from "@/constants/admin_analisys"
import { useTheme } from "next-themes"
import React from "react"
import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts"


const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

export const MonthlyChart = ({
  data,
  isAmount = true
}: {
  data: MonthlyRevenue[]
  isAmount?: boolean
}) => {

  const { theme } = useTheme()

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        No data available
      </div>
    )
  }

  

  const formattedData = data.map(item => ({
    ...item,
    label: `${MONTHS[item._id.month - 1]} ${item._id.year}`
  }))

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>

          <XAxis angle={-30} textAnchor="end" dataKey="label" />
          <YAxis />
          {isAmount && (<Tooltip
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff",
              color: theme === "dark" ? "#ffffff" : "#000000",
              borderRadius: "8px",
              border: "none",
            }}
            formatter={(value: any) => [`₹${value}`, "Amount"]}
            labelFormatter={(label) => label}
          />)}
          {!isAmount && (<Tooltip
           contentStyle={{
              backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff",
              color: theme === "dark" ? "#ffffff" : "#000000",
              borderRadius: "8px",
              border: "none",
            }}
            labelFormatter={(label) => label}
          />)}
          {isAmount && (
            <Bar dataKey="amount" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          )}
          {!isAmount && (
            <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyChart
