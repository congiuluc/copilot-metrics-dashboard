"use client";

import { PropsWithChildren } from "react";
import { PremiumRequestRecord, PremiumRequestStats, ModelRequestData, ModelUsageData } from "@/features/common/models";
import { proxy, useSnapshot } from "valtio";

interface IProps extends PropsWithChildren {
  premiumData: PremiumRequestRecord[];
}

class PremiumState {
  public isLoading = false;
  public data: PremiumRequestRecord[] = [];
  public stats: PremiumRequestStats = {
    totalPremiumRequests: 0,
    totalUniqueUsers: 0,
    totalModels: 0,
    totalInteractions: 0,
    averageUserRequests: 0,
  };

  public get modelsForRequests(): ModelRequestData[] {
    const modelMap = new Map<string, { requests: number; users: Set<string> }>();
    
    this.data.forEach(record => {
      const existing = modelMap.get(record.model) || { requests: 0, users: new Set() };
      existing.requests += record.requestsUsed;
      existing.users.add(record.user);
      modelMap.set(record.model, existing);
    });

    return Array.from(modelMap.entries()).map(([model, data]) => ({
      model,
      requests: data.requests,
      users: data.users.size,
    })).sort((a, b) => b.requests - a.requests);
  }

  public get modelsUsage(): ModelUsageData[] {
    const modelRequestsMap = new Map<string, number>();
    let totalRequests = 0;
    
    this.data.forEach(record => {
      const current = modelRequestsMap.get(record.model) || 0;
      modelRequestsMap.set(record.model, current + record.requestsUsed);
      totalRequests += record.requestsUsed;
    });

    return Array.from(modelRequestsMap.entries()).map(([model, usage]) => ({
      model,
      usage,
      percentage: totalRequests > 0 ? (usage / totalRequests) * 100 : 0,
    })).sort((a, b) => b.usage - a.usage);
  }

  public initData(data: PremiumRequestRecord[]): void {
    this.data = [...data];
    this.computeStats();
  }

  private computeStats(): void {
    const uniqueUsers = new Set(this.data.map(record => record.user));
    const uniqueModels = new Set(this.data.map(record => record.model));
    const totalRequests = this.data.reduce((sum, record) => sum + record.requestsUsed, 0);
    
    this.stats = {
      totalPremiumRequests: totalRequests,
      totalUniqueUsers: uniqueUsers.size,
      totalModels: uniqueModels.size,
      totalInteractions: this.data.length,
      averageUserRequests: uniqueUsers.size > 0 ? totalRequests / uniqueUsers.size : 0,
    };
  }
}

export const premiumStore = proxy(new PremiumState());

export const usePremium = () => {
  return useSnapshot(premiumStore, { sync: true }) as PremiumState;
};

export const DataProvider = ({ children, premiumData }: IProps) => {
  premiumStore.initData(premiumData);
  return <>{children}</>;
};