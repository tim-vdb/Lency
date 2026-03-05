import { SubscriptionsAction } from "../repositories/subscriptions.action";

export const SubscriptionsService = {
  findByIdSubscription: async (id: string) => {
    return SubscriptionsAction.findById(id);
  },

  findAllSubscriptions: async () => {
    return SubscriptionsAction.findAll();
  },

  createSubscription: async (
    userId: string,
    data: { status: "ACTIVE" | "CANCELED" | "EXPIRED"; startedAt: Date; endedAt?: Date | null }
  ) => {
    return SubscriptionsAction.create(userId, data);
  },

  updateSubscription: async (
    id: string,
    data: { status?: "ACTIVE" | "CANCELED" | "EXPIRED"; startedAt?: Date; endedAt?: Date | null; userId?: string }
  ) => {
    return SubscriptionsAction.update(id, data);
  },

  deleteSubscription: async (id: string) => {
    return SubscriptionsAction.delete(id);
  },
};