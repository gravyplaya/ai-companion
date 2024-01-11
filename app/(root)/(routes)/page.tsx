import React, { useEffect, useState } from "react";

import { getCategories, getCompanions } from "@/lib/nocodb";
import { Categories } from "@/components/categories";
import { Companions } from "@/components/companions";
import { SearchInput } from "@/components/search-input";
import { useToast } from "@/components/ui/use-toast";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
    error?: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const companions = await getCompanions();
  const categories = await getCategories();

  return (
    <div className="h-full p-4 space-y-2">
      <h2>
        {searchParams?.error &&
          "Sorry bot creation limit exceeded. Please subscribe to create more. "}
      </h2>
      <SearchInput />
      <Categories data={categories} />
      {/* {companions && <pre>{JSON.stringify(companions.list, null, 2)}</pre>} */}
      <Companions data={companions?.list} />
    </div>
  );
};

export default RootPage;
