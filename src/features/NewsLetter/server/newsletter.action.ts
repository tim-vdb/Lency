'use server';

import { actionClient } from '@/lib/safe-action-client';
import { NewsletterFormSchema } from './newsletter.schema';

export const NewsletterSafeAction = actionClient
  .inputSchema(NewsletterFormSchema)
  .action(async ({ parsedInput: input }) => {
    // if (input.name == "Timothée") {
    //     throw new SafeError("Timothée, tu es trop fort !")
    // }
    // const addToNewsletter = await prisma.newsletter.create({
    //     data: {
    //         name: input.name,
    //         email: input.email
    //     }
    // })
    // console.log("hey", addToNewsletter)
    // return addToNewsletter
  });

export const GetSubscriberAction = async () => {
  // return await prisma.newsletter.findMany();
};
