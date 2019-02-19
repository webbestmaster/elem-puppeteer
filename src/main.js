// @flow

import puppeteer from 'puppeteer';

import {appConst} from './const';
import {login} from './script/login';

(async () => {
    const browser = await puppeteer.launch({headless: false, slowMo: 250});
    const page = await browser.newPage();

    await page.goto(appConst.site.url);

    await login(page);

    await page.screenshot({path: './screenshot/site.png'});

    await browser.close();
})();
