import { auth } from "@clerk/nextjs";

import { api } from "@/lib/nocodb";
import { MAX_FREE_COUNTS } from "@/constants";

export const incrementApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  // const userApiLimit_old = await prismadb.userApiLimit.findUnique({
  //   where: { userId: userId },
  // });

  const userApiLimit = await api.dbViewRow
    .list("noco", "CelebPersonas", "UserApiLimit", "UserapilimitCsv", {
      offset: 0,
      where: "(userId,eq," + userId + "))",
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.error(error);
    });

  // if (userApiLimit) {
  //   await prismadb.userApiLimit.update({
  //     where: { userId: userId },
  //     data: { count: userApiLimit.count + 1 },
  //   });
  // } else {
  //   await prismadb.userApiLimit.create({
  //     data: { userId: userId, count: 1 },
  //   });
  // }
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  // const userApiLimit = await prismadb.userApiLimit.findUnique({
  //   where: { userId: userId },
  // });

  // if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
  //   return true;
  // } else {
  //   return false;
  // }
};

export const getApiLimitCount = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  // const userApiLimit = await prismadb.userApiLimit.findUnique({
  //   where: {
  //     userId,
  //   },
  // });

  // if (!userApiLimit) {
  //   return 0;
  // }

  // return userApiLimit.count;
};
