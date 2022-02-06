const client = require("../app");
require("dotenv").config();

module.exports = {
  checkCache: async (url) => {
    let returnedJson = await client.client.get(url);
    if (returnedJson) {
      return JSON.parse(returnedJson);
    } else {
      return false;
    }
  },

  setcache: async (url, json) => {
    await client.client.set(url, JSON.stringify(json));
    json = await client.client.get(url);
    await json;
    return JSON.parse(json);
  },
};
