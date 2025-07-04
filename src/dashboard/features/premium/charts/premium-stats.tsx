"use client";

import { Card, CardContent } from "@/components/ui/card";
import { usePremium } from "../premium-state";
import { ChartHeader } from "@/features/common/chart-header";
import StatsCard from "@/features/dashboard/charts/stats-card";

export const PremiumStats = () => {
  const { stats, isLoading } = usePremium();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 col-span-4">
      <StatsCard
        title="Total Premium Requests"
        tip="Total number of premium requests made across all users and models"
        description="Sum of all requests used"
        value={isLoading ? "..." : stats.totalPremiumRequests.toLocaleString()}
      />
      <StatsCard
        title="Total Unique Users"
        tip="Number of unique users who made premium requests"
        description="Distinct users count"
        value={isLoading ? "..." : stats.totalUniqueUsers.toString()}
      />
      <StatsCard
        title="Total Models"
        tip="Number of unique models used for premium requests"
        description="Distinct models count"
        value={isLoading ? "..." : stats.totalModels.toString()}
      />
      <StatsCard
        title="Total Interactions"
        tip="Total number of individual request records/interactions"
        description="Total request events"
        value={isLoading ? "..." : stats.totalInteractions.toLocaleString()}
      />
      <StatsCard
        title="Average User Requests"
        tip="Average number of requests per user"
        description="Requests per user"
        value={isLoading ? "..." : stats.averageUserRequests.toFixed(1)}
      />
    </div>
  );
};