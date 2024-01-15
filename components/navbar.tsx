"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";

const font = Poppins({ weight: "600", subsets: ["latin"] });
type NavbarProps = {
  isPro: boolean;
};

export const Navbar = ({ isPro }: NavbarProps) => {
  const proModal = useProModal();

  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 h-16 border-b border-primary/10 bg-secondary">
      <div className="flex items-center">
        <MobileSidebar isPro={isPro} />
        <Link href="/">
          <h1
            className={cn(
              "hidden md:block text-xl md:text-3xl font-bold text-primary",
              font.className
            )}
          >
            Celebrity Personas
          </h1>
          <h2
            className={cn(
              "hidden md:block text-xs md:text-1xl  text-green-500",
              font.className
            )}
          >
            beta
          </h2>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        <ModeToggle />
        <SignedIn>
          {!isPro && (
            <Button onClick={proModal.onOpen} size="sm" variant="premium">
              Upgrade
              <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
            </Button>
          )}
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </div>
  );
};
