const express = require("express");
const redis = require("redis");
const path = require("path");
const cache = require("./src/cache");
const ss = require("./src/puppeteer");

// Fetching Env Vars from .env
require("dotenv").config();

// Defining Express App and Port
const app = express();
const port = process.env.EXPRESS_PORT || 3000;

// Setting Public Folder
// app.use('/css', express.static(path.join(__dirname, './public/css')));
// app.use('/js', express.static(path.join(__dirname, './public/js')));
app.use("/images", express.static(path.join(__dirname, "./public/images")));

// Connecting to Redis and Launching Express App
const client = redis.createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URI}:${process.env.REDIS_PORT}`,
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect().then(() => console.log("Redis Connected!"));

// Exporting Connected Client
exports.client = client;

// Run Cache Cleanup Check every 1 hour
setInterval(async () => {
  cache.delCache();
}, 1000 * 60 * 60);

// All the routes
app.get("/", (req, res) => {
  res.send("Hello World!");
  // res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api", (req, res) => {
  // Default Values
  let useLink = "https://github.com/AmreshSinha";
  let useDimension = "1920x1080";
  let useDevice = "desktop";
  let useDelay = 200;
  let errorState = false;

  // https://gs.statcounter.com/screen-resolution-stats/desktop/worldwide
  const defaultDesktopRes = {
    X: 1920,
    Y: 1080,
  };

  // https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide
  const defaultMobileRes = {
    X: 360,
    Y: 800,
  };

  // https://gs.statcounter.com/screen-resolution-stats/tablet/worldwide
  const defaultTabletRes = {
    X: 768,
    Y: 1024,
  };

  // Params
  let link = req.query.link;
  let dimension = req.query.dimension;
  let device = req.query.device;
  let delay = req.query.delay; // in ms
  let paramsBoolObject = {
    link: true,
    dimension: false,
    device: false,
    delay: false,
  };

  // Function for Validating Params
  function isValidUrl(_string) {
    let url_string;
    try {
      url_string = new URL(_string);
    } catch (_) {
      return false;
    }
    return url_string.protocol === "http:" || url_string.protocol === "https:";
  }
  function isValidDimension(_string) {
    const matchPattern = /^([0-9].*)x([1-9].*)$/;
    if (matchPattern.test(_string)) {
      const xy = _string.split("x");
      if (xy.length != 2) {
        return false;
      } else {
        if (xy[0] < 100 || xy[1] < 100) {
          return false;
        } else {
          return true;
        }
      }
    }
    return matchPattern.test(_string);
  }
  function isValidDevice(_string) {
    const deviceList = ["desktop", "mobile", "tablet"];
    for (let i = 0; i < deviceList.length; i++) {
      if (_string == deviceList[i]) {
        return true;
        break;
      }
    }
    return true;
  }
  function isValidDelay(_number) {
    if (_number >= 0 && _number <= 5000) {
      return true;
    }
  }

  // Checking what params have been provided and verifying them
  if (link) {
    if (isValidUrl(link)) {
      useLink = link;
    } else {
      errorState = true;
      paramsBoolObject.link = false;
      res.status(400).send({
        status: "Error 400",
        code: "ERR_INVALID_LINK",
        message: "Not a good Link",
      });
    }
  } else {
    errorState = true;
    paramsBoolObject.link = false;
    res.status(400).send({
      status: "Error 400",
      code: "ERR_NO_LINK",
      message: "Link not provided",
    });
  }
  if (dimension && !errorState) {
    if (isValidDimension(dimension)) {
      useDimension = dimension;
      paramsBoolObject.dimension = true;
    } else {
      errorState = true;
      res.status(400).send({
        status: "Error 400",
        code: "ERR_INVALID_DIMENSION",
        message: "Not a good Dimension",
      });
    }
  }
  if (device && !errorState) {
    if (isValidDevice(device)) {
      useDevice = device;
      paramsBoolObject.device = true;
    } else {
      errorState = true;
      res.status(400).send({
        status: "Error 400",
        code: "ERR_INVALID_DEVICE",
        message: "Not a good Device",
      });
    }
  }
  if (delay && !errorState) {
    if (isValidDelay(delay)) {
      useDelay = delay;
      paramsBoolObject.delay = true;
    } else {
      errorState = true;
      res.status(400).send({
        status: "Error 400",
        code: "ERR_INVALID_DELAY",
        message: "Delay is not valid or not in range",
      });
    }
  }

  if (!errorState) {
    // Forming a query string
    let query = `${useLink}-${useDimension}-${useDevice}-${useDelay}`;
    query = query.replace(/\W/g, "");

    // Checking if the file is in cache or not
    cache
      .checkCache(query)
      .then((result) => {
        if (result) {
          res.sendFile(path.join(__dirname, result.filepath));
        } else {
          // If not in cache, then create a screenshot and add to cache
          if (dimension) {
            let xDim, yDim;
            let arr = useDimension.split("x");
            xDim = parseInt(arr[0], 10);
            yDim = parseInt(arr[1], 10);
            ss.screenshot(useLink, xDim, yDim, useDelay, query)
              .then((filepath) => {
                cache.setcache(query, { filepath: filepath }).then((result) => {
                  res.sendFile(path.join(__dirname, result.filepath));
                });
              })
              .catch((err) => {
                res.status(400).send({
                  status: "Error 400",
                  code: "ERR_TIMEOUT",
                  message: "Screenshot Failed due to timeout",
                });
              });
          } else if (!dimension && device) {
            let xDim, yDim;
            if (device == "desktop") {
              (xDim = defaultDesktopRes.X), (yDim = defaultDesktopRes.Y);
              ss.screenshot(useLink, xDim, yDim, useDelay, query)
                .then((filepath) => {
                  cache
                    .setcache(query, { filepath: filepath })
                    .then((result) => {
                      res.sendFile(path.join(__dirname, result.filepath));
                    });
                })
                .catch((err) => {
                  res.status(400).send({
                    status: "Error 400",
                    code: "ERR_TIMEOUT",
                    message: "Screenshot Failed due to timeout",
                  });
                });
            } else if (device == "mobile") {
              ss.screenshot(
                useLink,
                defaultMobileRes.X,
                defaultMobileRes.Y,
                useDelay,
                query
              )
                .then((filepath) => {
                  cache
                    .setcache(query, { filepath: filepath })
                    .then((result) => {
                      res.sendFile(path.join(__dirname, result.filepath));
                    });
                })
                .catch((err) => {
                  res.status(400).send({
                    status: "Error 400",
                    code: "ERR_TIMEOUT",
                    message: "Screenshot Failed due to timeout",
                  });
                });
            } else if (device == "tablet") {
              ss.screenshot(
                useLink,
                defaultTabletRes.X,
                defaultTabletRes.Y,
                useDelay,
                query
              )
                .then((filepath) => {
                  cache
                    .setcache(query, { filepath: filepath })
                    .then((result) => {
                      res.sendFile(path.join(__dirname, result.filepath));
                    });
                })
                .catch((err) => {
                  res.status(400).send({
                    status: "Error 400",
                    code: "ERR_TIMEOUT",
                    message: "Screenshot Failed due to timeout",
                  });
                });
            }
          } else {
            ss.screenshot(
              useLink,
              defaultDesktopRes.X,
              defaultDesktopRes.Y,
              useDelay,
              query
            )
              .then((filepath) => {
                cache.setcache(query, { filepath: filepath }).then((result) => {
                  res.sendFile(path.join(__dirname, result.filepath));
                });
              })
              .catch((err) => {
                res.status(400).send({
                  status: "Error 400",
                  code: "ERR_TIMEOUT",
                  message: "Screenshot Failed due to timeout",
                });
              });
          }
        }
      })
      .catch((err) => console.error(err));
  }
});

app.listen(port, () => {
  console.log(`SShot is listening on  http://localhost:${port}`);
});
