---
label: Quick Start
icon: rocket
---
## Welcome to SSHOT

(/s:shot/)

[SSHOT](https://sshot.fossian.com/) is a :sparkles: **Web Screenshot API** :sparkles: with caching kept in mind!

![](./public/images/sshot.png)

Just pass in the parameters for the screenshot, copy the link and you are good to go! :rocket:

A screenshot is fetched using [puppeteer](https://github.com/puppeteer/puppeteer) and :sparkles: cached for 24 hours :sparkles:. The expiry time will keep getting pushed forward if the file is being accessed frequently.

---

## Quick start

You can call it from anywhere whether its a normal HTTP GET call from browser or a curl request from terminal

+++ HTTP GET

```
https://sshot.fossian.com/api?link=https://github.com
```

+++ cURL

```bash
curl "https://sshot.fossian.com/api?link=https://github.com" --output filename.png
```

+++ Wget

```bash
wget "https://sshot.fossian.com/api?link=https://github.com" -O filename.png
```

+++

If the request is not cached or expired, a new screenshot will be taken and a cache will stored as a record in redis database.

Cache will expire after 24 hours of inactivity :wastebasket:.

---

## API Parameters

Endpoint: ```https://sshot.fossian.com/api?```

Example: ```https://sshot.fossian.com/api?link=https://google.com&device=tablet```

| Parameter   | Description |
| ----------- | ----------- |
| `link`      | Link of the webpage whose screenshot you want to take. For long links URL Percent-Encoding is recommended.<br />Links should start with `http(s)://` |
| `dimension` | Size of the website screenshot in format `[width]x[height]` .<br /> Default dimension is `1920x1080` .<br /> `width` can be any number between `100` and `1920` (both inclusive).<br /> `height` can be any number between `100` and `1920` (both inclusive).<br />[!badge Default:] `1920x1080` pixels<br /><br /> Currently full length webpage screenshot is not implemented.<br /> Will implement it soon don't worry! :sunglasses:<br /><br /> Examples: <br />`360x800` - [mobile dimension](https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide) website 360x800 pixels<br />`800x600` - website screenshot size 800x600 pixels<br/>`768x1024` - [tablet dimension](https://gs.statcounter.com/screen-resolution-stats/tablet/worldwide) website 768x1024 pixels<br />`1024x768` - website screenshot size 1024x768 pixels<br />`1920x1080` - [desktop dimension](https://gs.statcounter.com/screen-resolution-stats/desktop/worldwide) website 1920x1080 pixels<br /> |
| `device`    | Feeling lazy in providing a dimension?<br />You can just pass a device as a parameter for dimension.<br />These are the device params currently available: `desktop`, `mobile` and `tablet` .<br /><br />[!badge variant="warning" text="Note"]<br />If `dimension` and `device` both are provided then `dimension` will be used and `device` will be ignored. |
| `delay`     | `delay` comes handy if the website has a lot animations. Using `delay` you can wait for the specified time and then take the screenshot after that.<br />[!badge Default:] delay is `200` ms.<br /><br />Allowed range is between `0` and `5000` ms (both inclusive). |

---

## Error Messages

You may get a `400` Error Header and a `Error 400` status message when you provide any parameter wrongly.

| Error `code`            | Description                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| `ERR_INVALID_LINK`      | Link provided is not valid! Make sure it starts with `http(s)://` .                                            |
| `ERR_NO_LINK`           | Link is not provided! Looks like you haven't provided any `link` at all!                                       |
| `ERR_INVALID_DIMENSION` | Dimension provided is not valid! Make sure the `dimension` are in range and in the format `[width]x[height]` . |
| `ERR_INVALID_DEVICE`    | Device provided is not valid! Make sure the `device` is `desktop`, `mobile` or `tablet` .                      |
| `ERR_INVALID_DELAY`     | Delay provided is not valid! Make sure the `delay` is in the range `0` to `5000` .                             |
| `ERR_TIMEOUT`           | Link provided took more than `10s` to load and thus haulted and resulted in `ERR_TIMEOUT`                      |
