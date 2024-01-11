import Image from "next/image";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";

interface Item {
  Id: string;
  name: string;
  userId: string;
  userName: string;
  src: string;
  description: string;
  messages: number;
}

export const Companions = ({ data }: any) => {
  if (data.length === 0) {
    return (
      <div className="pt-10 flex flex-col items-center justify-center space-y-3">
        <div className="relative w-60 h-60">
          <Image fill className="grayscale" src="/empty.png" alt="Empty" />
        </div>
        <p className="text-sm text-muted-foreground">No companions found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
      {data.map((item: Item) => (
        <Card
          key={item.name}
          className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
        >
          <Link href={`/chat/${item.Id}`}>
            <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
              <div className="relative w-32 h-32">
                <Image
                  src={item.src}
                  fill
                  className="rounded-xl object-cover"
                  alt="Character"
                />
              </div>
              <p className="font-bold">{item.name}</p>
              <p className="text-xs">{item.description}</p>
            </CardHeader>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <p className="lowercase">@{item.userName}</p>
              <div className="flex items-center">
                <MessagesSquare className="w-3 h-3 mr-1" />
                {item.messages}
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};
