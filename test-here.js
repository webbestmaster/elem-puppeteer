const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false, slowMo: 250});
    const page = await browser.newPage();

    await page.goto('http://elem.mobi');

    const asdsa = await page.$('body');

    await browser.close();
})();

