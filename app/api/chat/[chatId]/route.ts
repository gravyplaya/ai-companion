import dotenv from "dotenv";
import { StreamingTextResponse, LangChainStream } from "ai";
import { auth, currentUser } from "@clerk/nextjs";
import { Replicate } from "langchain/llms/replicate";
import { CallbackManager } from "langchain/callbacks";
import { NextResponse } from "next/server";
import { postMessage, getCompanionById } from "@/lib/nocodb";
import { useEffect, useState } from "react";
import { Readable } from "stream";

import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";

dotenv.config({ path: `.env` });

interface Companion {
  companionId: string;
  seed: string;
  // other properties...
}
interface CompanionData {
  instructions: string;
  seed: string;
  name: string;
  // other properties...
}

export async function POST(
  request: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const { message } = await request.json();
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const identifier = request.url + "-" + user.id;
    const { success } = await rateLimit(identifier);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const companion: Companion = (await postMessage(
      params.companionId,
      user.id,
      message
    )) as Companion;

    let companionData: CompanionData | null = null;
    try {
      const response = await getCompanionById(params.companionId);
      companionData = response as CompanionData | null;
    } catch (error) {
      console.error("Error fetching companion data:", error);
    }

    const companionPrompt =
      companionData?.instructions + "\n\n" + companionData?.seed;
    // const companion = await prismadb.companion.update({
    //   where: {
    //     id: params.chatId,
    //   },
    //   data: {
    //     messages: {
    //       create: {
    //         content: prompt,
    //         role: "user",
    //         userId: user.id,
    //       },
    //     },
    //   },
    // });

    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }

    // const name = companionData?.name;
    // const companion_file_name = name + ".txt";

    // const companionKey = {
    //   companionName: name!,
    //   userId: user.id,
    //   modelName: "llama2-13b",
    // };
    // const memoryManager = await MemoryManager.getInstance();

    // const records = await memoryManager.readLatestHistory(companionKey);
    // if (records.length === 0) {
    //   await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
    // }
    // await memoryManager.writeToHistory("User: " + message + "\n", companionKey);

    // // Query Pinecone

    // const recentChatHistory = await memoryManager.readLatestHistory(
    //   companionKey
    // );

    // // Right now the preamble is included in the similarity search, but that
    // // shouldn't be an issue

    // const similarDocs = await memoryManager.vectorSearch(
    //   recentChatHistory,
    //   companion_file_name
    // );

    // let relevantHistory = "";
    // if (!!similarDocs && similarDocs.length !== 0) {
    //   relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    // }
    const { handlers } = LangChainStream();
    //     // Call Perplexity for inference
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "pplx-7b-chat",
        stream: true,
        messages: [
          { role: "system", content: "prompt" },
          { role: "user", content: "how do rockets work?" },
        ],
      }),
    };

    let s = new Readable();
    // s.on("data", (chunk) => {
    //   console.log('readable chuck: ',chunk.toString());
    // });
    try {
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        options
      );
      const reader = response.body?.getReader();
      const stream = new Readable({
        read: async function () {
          const result = await reader?.read();
          if (result?.done) {
            this.push(null);
          } else {
            if (result !== undefined) {
              this.push(new Buffer(result.value));
            } else {
              console.log("result undefined");
            }
          }
        },
      });
      s = stream;
      let whatwgStream = new ReadableStream({
        start(controller) {
          s.on("data", (chunk) => {
            controller.enqueue(chunk);
          });
          s.on("end", () => {
            controller.close();
          });
          s.on("error", (err) => {
            controller.error(err);
          });
        },
      });
      return new StreamingTextResponse(whatwgStream);
    } catch (err) {
      console.error(err);
    }
    // s = await fetch(
    //   "https://api.perplexity.ai/chat/completions",
    //   options
    // )
    //   //.then((response) => response.json())
    //   .then((response) => {
    //     console.log('pplexResponse: ', response);
    //     s.push(response);
    //     s.push(null);
    //     return response;
    //   })
    //   .catch((err) => console.error(err));

    //     const model = new Replicate({
    //       model:
    //         "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
    //       input: {
    //         max_length: 2048,
    //       },
    //       apiKey: process.env.REPLICATE_API_TOKEN,
    //       callbackManager: CallbackManager.fromHandlers(handlers),
    //     });

    //     // Turn verbose on for debugging
    //     model.verbose = true;

    //     const resp = String(
    //       await model
    //         .call(
    //           `
    //         ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix.

    //         ${companion.instructions}

    //         Below are relevant details about ${companion.name}'s past and the conversation you are in.
    //         ${relevantHistory}

    //         ${recentChatHistory}\n${companion.name}:`
    //         )
    //         .catch(console.error)
    //     );

    //     const cleaned = resp.replaceAll(",", "");
    //     const chunks = cleaned.split("\n");
    //     const response = chunks[0];

    //     await memoryManager.writeToHistory("" + response.trim(), companionKey);
    // var Readable = require("stream").Readable;

    // let s = new Readable();
    // //s.push(response);
    // s.push(null);
    //     if (response !== undefined && response.length > 1) {
    //       memoryManager.writeToHistory("" + response.trim(), companionKey);

    //       // await prismadb.companion.update({
    //       //   where: {
    //       //     id: params.chatId,
    //       //   },
    //       //   data: {
    //       //     messages: {
    //       //       create: {
    //       //         content: response.trim(),
    //       //         role: "system",
    //       //         userId: user.id,
    //       //       },
    //       //     },
    //       //   },
    //       // });
    //     }

    // return new StreamingTextResponse(s);
  } catch (error) {
    return new NextResponse("Internal Error: " + error, { status: 500 });
  }
}
