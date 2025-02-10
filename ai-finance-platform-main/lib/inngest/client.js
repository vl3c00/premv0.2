import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "trcBudg8", // Unique app ID
  name: "trcBudg8",
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000, // Exponential backoff
    maxAttempts: 2,
  }),
});
