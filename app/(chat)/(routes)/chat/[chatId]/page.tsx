import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import {
  api,
  getCompanions,
  getMessages,
  getCompanionById,
} from "@/lib/nocodb";

import { ChatClient } from "./components/client";

interface ChatIdPageProps {
  params: {
    chatId: string;
  };
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const companion = await getCompanionById(params.chatId);
  const messages = await getMessages(params.chatId, userId);
  // console.dir({ companion, messages });
  // companion.messages = {messages};
  // const companion = await prismadb.companion.findUnique({
  //   where: {
  //     id: params.chatId
  //   },
  //   include: {
  //     messages: {
  //       orderBy: {
  //         createdAt: "asc"
  //       },
  //       where: {
  //         userId,
  //       },
  //     },
  //     _count: {
  //       select: {
  //         messages: true,
  //       }
  //     }
  //   }
  // });

  if (!companion) {
    return redirect("/");
  }

  return <ChatClient companion={companion} />;
};

export default ChatIdPage;
