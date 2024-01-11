import { auth } from "@clerk/nextjs";

import { api } from "@/lib/nocodb";
import { isValid } from "zod";

interface userSubscription {
  Id: string;
  Id1: string;
  StripeCustomerId: string;
  StripeSubscriptionId: string;
  StripePriceId: string;
  StripeCurrentPeriodEnd: string;
}
const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userSubscription = await api.dbViewRow
    .findOne(
      "noco",
      "CelebPersonas",
      "Usersubscriptions",
      "UsersubscriptionCsv",
      {
        where: "(Id,eq,1)",
      }
    )
    .then(function (subs) {
      console.log(subs);
      return subs;
    })
    .catch(function (error) {
      console.error(error);
    });

  if (!userSubscription) {
    return false;
  }

  const isValid =
    //  userSubscription.stripePriceId &&
    //  userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

    console.log();
  return true;
};
