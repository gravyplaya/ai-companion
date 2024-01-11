import { Api } from "nocodb-sdk";

const api = new Api({
  baseURL: "https://nocodb-xvwv.onrender.com",
  headers: {
    "xc-token": process.env.NOCODB_TOKEN,
  },
});

function getCompanions() {
  return api.dbViewRow
    .list("noco", "CelebPersonas", "Companions", "CompanionCsv", {
      offset: 0,
      where: "",
    })
    .then(function (companions) {
      return companions;
    })
    .catch(function (error) {
      console.error(error);
    });
}

function getCompanionById(id: string) {
  return api.dbViewRow
    .list("noco", "CelebPersonas", "Companions", "CompanionCsv", {
      offset: 0,
      where: "(Id,eq," + id + ")",
    })
    .then(function (companion) {
      return companion.list[0];
    })
    .catch(function (error) {
      console.error(error);
    });
}

function getCategories() {
  return api.dbViewRow
    .list("noco", "CelebPersonas", "Categories", "CategoryCsv", {
      offset: 0,
      where: "",
    })
    .then(function (catys) {
      return catys.list;
    })
    .catch(function (error) {
      console.error(error);
    });
}

function getMessages(companionId: string, userId: string) {
  return api.dbViewRow
    .list("noco", "CelebPersonas", "Messages", "MessageCsv", {
      offset: 0,
      where:
        "(companionId,eq," + companionId + ")~and(userId,eq," + userId + ")",
    })
    .then(function (messages) {
      return messages.list || {};
    })
    .catch(function (error) {
      console.error(error);
    });
}

function postMessage(companionId: string, userId: string, message: string) {
  return api.dbViewRow
    .create("noco", "CelebPersonas", "Messages", "MessageCsv", {
      Role: "user",
      companionId: companionId,
      content: message,
      userId: userId,
    })
    .then(function (messages) {
      return messages || {};
    })
    .catch(function (error) {
      console.error(error);
    });
}

export {
  api,
  getCompanions,
  getCategories,
  getMessages,
  getCompanionById,
  postMessage,
};
