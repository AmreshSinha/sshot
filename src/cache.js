const client = require("../app");
require("dotenv").config();

module.exports = {
  checkCache: async (query) => {
    let returnedJson = await client.client.get(query);
    if (returnedJson) {
      client.client.expire(query, 60*60*24);
      return JSON.parse(returnedJson);
    } else {
      return false;
    }
  },

  setcache: async (query, json) => {
    await client.client.set(query, JSON.stringify(json));
    await client.client.expire(query, 60*60*24);
    json = await client.client.get(query);
    await json;
    return JSON.parse(json);
  },
};
