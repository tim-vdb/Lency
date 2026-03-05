import { NewsletterSubscribersAction } from "../repositories/newsletterSubscribers.action";

export const NewsletterSubscribersService = {
  findByIdSubscriber: async (id: string) => {
    return NewsletterSubscribersAction.findById(id);
  },

  findAllSubscribers: async () => {
    return NewsletterSubscribersAction.findAll();
  },

  createSubscriber: async (data: { email: string; userId?: string | null }) => {
    return NewsletterSubscribersAction.create(data);
  },

  updateSubscriber: async (
    id: string,
    data: { email?: string; userId?: string | null }
  ) => {
    return NewsletterSubscribersAction.update(id, data);
  },

  deleteSubscriber: async (id: string) => {
    return NewsletterSubscribersAction.delete(id);
  },
};