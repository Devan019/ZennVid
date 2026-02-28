"use client"

import { useTheme } from 'next-themes'
import React from 'react'
import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts'

const Chart = ({
  data,
  XAxisKey,
  isAmount=true,
  isDate=true
}: {
  data: { _id: string; amount : number }[] | { _id: string; count: number }[]
  XAxisKey: string
  isAmount?: boolean
  isDate?: boolean
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-500">
        No data available
      </div>
    )
  }
  const {theme} = useTheme();

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          {isDate && (<XAxis
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
            dataKey={XAxisKey} angle={-30} textAnchor="end" />)}
          {!isDate && (<XAxis
            dataKey={XAxisKey} angle={-30} textAnchor="end" />)}
          
          <YAxis />
          {isAmount && (<Tooltip
           formatter={(value: any) => [`₹${value}`, "Amount"]}
            labelFormatter={(label) => label}
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff",
              color: theme === "dark" ? "#ffffff" : "#000000",
              borderRadius: "8px",
              border: "none",
            }}
          />)}
          {!isAmount && (<Tooltip
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff",
              color: theme === "dark" ? "#ffffff" : "#000000",
              borderRadius: "8px",
              border: "none",
            }}
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

export default Chart
