const puppeteer = require('puppeteer');
const path = require('path');

module.exports = {
  screenshot : async (link, xDim, yDim, delay) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: xDim,
      height: yDim
    })
    await page.goto(link)
    await page.waitForTimeout(delay)
    let pageTitle = await page.title();
    pageTitle = pageTitle.replace(/\W/g, "");
    await page.screenshot({ path: path.join(__dirname, `../cache/${pageTitle}.png`) });
    await browser.close();
    return (`./cache/${pageTitle}.png`);
  }
}