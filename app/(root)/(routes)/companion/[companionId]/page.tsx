import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import { getCategories, getCompanions } from "@/lib/nocodb";
import { checkSubscription } from "@/lib/subscription";
import {
  checkApiLimit,
  incrementApiLimit,
  getApiLimitCount,
} from "@/lib/api-limit";
import { MAX_FREE_COUNTS } from "@/constants";

import { CompanionForm } from "./components/companion-form";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

const CompanionIdPage = async ({ params }: CompanionIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const checkLimit = await checkApiLimit();
  const isPro = await checkSubscription();

  if (!checkLimit && !isPro) {
    return redirect("/?error=limitExceeded");
  } else {
    const incLimit = await incrementApiLimit();
    // return redirect("/");
  }

  const companion = await getCompanions();
  const categories = await getCategories();

  return <CompanionForm initialData={companion} categories={categories} />;
};

export default CompanionIdPage;
