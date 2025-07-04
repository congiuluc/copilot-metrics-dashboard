import { PremiumRequestRecord } from "@/features/common/models";

export const samplePremiumData: PremiumRequestRecord[] = [
  {
    timestamp: "2025-06-06T08:09:58Z",
    user: "user_1",
    model: "gpt-4.1-2025-04-14",
    requestsUsed: 1.0,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: "Unlimited"
  },
  {
    timestamp: "2025-06-06T08:09:52Z",
    user: "user_2",
    model: "gpt-4o-2024-11-20",
    requestsUsed: 1.0,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: "Unlimited"
  },
  {
    timestamp: "2025-06-06T08:09:50Z",
    user: "user_3",
    model: "gpt-4o-2024-11-20",
    requestsUsed: 1.0,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: "Unlimited"
  },
  {
    timestamp: "2025-06-06T08:09:42Z",
    user: "user_4",
    model: "claude-3.5-sonnet",
    requestsUsed: 1.0,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: "Unlimited"
  },
  {
    timestamp: "2025-06-06T08:09:41Z",
    user: "user_5",
    model: "claude-sonnet-4",
    requestsUsed: 1.0,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: "Unlimited"
  },
  {
    timestamp: "2025-06-06T08:09:31Z",
    user: "user_6",
    model: "gpt-4.1-2025-04-14",
    requestsUsed: 1.0,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: "Unlimited"
  },
  {
    timestamp: "2025-06-06T08:09:30Z",
    user: "user_7",
    model: "claude-3.7-sonnet-thought",
    requestsUsed: 1.25,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: "Unlimited"
  },
  {
    timestamp: "2025-06-06T08:09:25Z",
    user: "user_2",
    model: "gpt-4o-2024-11-20",
    requestsUsed: 1.0,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: "Unlimited"
  },
  {
    timestamp: "2025-06-06T08:09:23Z",
    user: "user_8",
    model: "claude-sonnet-4",
    requestsUsed: 1.0,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: "Unlimited"
  },
  {
    timestamp: "2025-06-06T08:09:23Z",
    user: "user_9",
    model: "gpt-4.1-2025-04-14",
    requestsUsed: 1.0,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: "Unlimited"
  }
];