const client = require("../app");
require("dotenv").config();

module.exports = {
  checkCache: async (url) => {
    let returnedJson = await client.client.get(url);
    if (returnedJson) {
      client.client.expire(url, 60*60*24);
      return JSON.parse(returnedJson);
    } else {
      return false;
    }
  },

  setcache: async (url, json) => {
    await client.client.set(url, JSON.stringify(json));
    await client.client.expire(url, 60*60*24);
    json = await client.client.get(url);
    await json;
    return JSON.parse(json);
  },
};
