"use client";

import { Card, CardContent } from "@/components/ui/card";
import { usePremium } from "../premium-state";
import { ChartHeader } from "@/features/common/chart-header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const ModelsForRequests = () => {
  const { modelsForRequests, isLoading } = usePremium();

  if (isLoading) {
    return (
      <Card className="col-span-4 md:col-span-2">
        <ChartHeader title="Models for Requests" description="Request count by model" />
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 md:col-span-2">
      <ChartHeader 
        title="Models for Requests" 
        description="Number of requests per model"
        tip="Shows the total number of requests made for each model, along with the number of unique users"
      />
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelsForRequests} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="model" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toLocaleString() : value,
                  name === 'requests' ? 'Requests' : 'Users'
                ]}
                labelFormatter={(label) => `Model: ${label}`}
              />
              <Legend />
              <Bar dataKey="requests" fill="#8884d8" name="Requests" />
              <Bar dataKey="users" fill="#82ca9d" name="Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};