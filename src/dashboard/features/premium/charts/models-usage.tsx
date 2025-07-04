"use client";

import { Card, CardContent } from "@/components/ui/card";
import { usePremium } from "../premium-state";
import { ChartHeader } from "@/features/common/chart-header";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

export const ModelsUsage = () => {
  const { modelsUsage, isLoading } = usePremium();

  if (isLoading) {
    return (
      <Card className="col-span-4 md:col-span-2">
        <ChartHeader title="Models Usage" description="Usage distribution by model" />
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = modelsUsage.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <Card className="col-span-4 md:col-span-2">
      <ChartHeader 
        title="Models Usage" 
        description="Distribution of requests by model"
        tip="Shows the percentage of total requests handled by each model"
      />
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ model, percentage }) => 
                  percentage > 5 ? `${model} (${percentage.toFixed(1)}%)` : ''
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="usage"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name) => [
                  value.toLocaleString(),
                  'Requests'
                ]}
                labelFormatter={(label) => `Model: ${label}`}
              />
              <Legend 
                formatter={(value, entry) => 
                  `${entry.payload.model} (${entry.payload.percentage.toFixed(1)}%)`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};