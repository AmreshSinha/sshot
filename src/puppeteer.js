const puppeteer = require('puppeteer');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  screenshot : async (link, xDim, yDim, delay, query) => {
    let { stdout, stderr } = await exec('uname -m');
    stdout = stdout.replace(/(\r\n|\n|\r)/gm, "");
    let browser;
    if (stdout == "aarch64") {
      browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'], timeout: 10000 })
    } else {
      browser = await puppeteer.launch();
    }
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.setViewport({
      width: xDim,
      height: yDim
    })
    await page.goto(link)
    await page.waitForTimeout(delay)
    let pageTitle = query;
    // pageTitle = pageTitle.replace(/\W/g, "");
    await page.screenshot({ path: path.join(__dirname, `../cache/${pageTitle}.png`) });
    await browser.close();
    return (`./cache/${pageTitle}.png`);
  }
}