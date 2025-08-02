"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalaryChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="name" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                  <p className="font-medium text-sm">{label}</p>
                  {payload.map((item) => (
                    <p key={item.name} className="text-xs">
                      <span style={{ color: item.color }}>●</span> {item.name}: ${item.value}K
                    </p>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
        <Bar 
          dataKey="min" 
          fill="#94a3b8" 
          name="Min Salary" 
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          dataKey="median" 
          fill="#64748b" 
          name="Median Salary" 
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          dataKey="max" 
          fill="#475569" 
          name="Max Salary" 
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
