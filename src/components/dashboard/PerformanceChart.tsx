import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 20 },
  { name: 'Wed', value: 45 },
  { name: 'Thu', value: 15 },
  { name: 'Fri', value: 25 },
];

export function PerformanceChart() {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className="bg-[#27272A] border-transparent p-5 rounded-xl text-white col-span-1 flex flex-col min-h-[300px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-sm font-medium text-[#A1A1AA] mb-1">Cash Flow</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold">86%</span>
            <span className="text-xs text-green-400 font-medium">+15% vs last week</span>
          </div>
        </div>
      </div>

      <div className="flex-1 mt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#A1A1AA', fontSize: 12 }} 
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{ backgroundColor: '#18181A', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={32}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value === maxValue ? '#A855F7' : '#3f3f46'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
