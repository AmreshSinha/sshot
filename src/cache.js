const client = require("../app");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports = {
  checkCache: async (query) => {
    let returnedJson = await client.client.get(query);
    if (returnedJson) {
      client.client.expire(query, 60 * 60 * 24);
      return JSON.parse(returnedJson);
    } else {
      return false;
    }
  },

  setcache: async (query, json) => {
    await client.client.set(query, JSON.stringify(json));
    await client.client.expire(query, 60 * 60 * 24);
    json = await client.client.get(query);
    await json;
    return JSON.parse(json);
  },

  delCache: async () => {
    fs.readdir("./cache/", (err, files) => {
      if (err) {
        console.log(err);
      } else {

        // Remove .gitignore from the list
        for (let i = 0; i < files.length; i++) {
          if (files[i] == ".gitignore") {
            files.splice(i, 1);
            break;
          }
        }

        files.forEach((file) => {
          // Check if the file is in cache DB or not and then delete it if its not there
          module.exports.checkCache(path.parse(file).name).then((result) => {
            if (!result) {
              fs.unlink(path.join(__dirname, `../cache/${file}`), (err) => {
                if (err) {
                  console.log(err);
                }
              });
            }
          });
        });
      }
    });
  },
};
