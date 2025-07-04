import { describe, expect, it } from "vitest";
import { samplePremiumData } from "@/services/premium-sample-data";

describe("Premium Request Data Processing", () => {
  it("correctly processes sample premium data", () => {
    expect(samplePremiumData).toBeDefined();
    expect(samplePremiumData.length).toBeGreaterThan(0);
    
    const firstRecord = samplePremiumData[0];
    expect(firstRecord).toHaveProperty('timestamp');
    expect(firstRecord).toHaveProperty('user');
    expect(firstRecord).toHaveProperty('model');
    expect(firstRecord).toHaveProperty('requestsUsed');
    expect(firstRecord).toHaveProperty('exceedsMonthlyQuota');
    expect(firstRecord).toHaveProperty('totalMonthlyQuota');
  });

  it("contains expected data types", () => {
    const record = samplePremiumData[0];
    expect(typeof record.timestamp).toBe('string');
    expect(typeof record.user).toBe('string');
    expect(typeof record.model).toBe('string');
    expect(typeof record.requestsUsed).toBe('number');
    expect(typeof record.exceedsMonthlyQuota).toBe('boolean');
    expect(typeof record.totalMonthlyQuota).toBe('string');
  });

  it("calculates stats correctly from sample data", () => {
    const uniqueUsers = new Set(samplePremiumData.map(r => r.user));
    const uniqueModels = new Set(samplePremiumData.map(r => r.model));
    const totalRequests = samplePremiumData.reduce((sum, r) => sum + r.requestsUsed, 0);
    
    expect(uniqueUsers.size).toBe(9); // user_1 through user_9
    expect(uniqueModels.size).toBe(5); // Different models
    expect(totalRequests).toBe(10.25); // Sum of all requests
    expect(samplePremiumData.length).toBe(10); // Total interactions
  });
});