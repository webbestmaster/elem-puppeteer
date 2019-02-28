// @flow

import puppeteer from 'puppeteer';

import type {Page, Browser} from 'puppeteer';

import {appConst} from '../const';

export async function runSystem(): Promise<{ page: Page, browser: Browser }> {
    const browser = await puppeteer.launch({headless: !true, slowMo: 50});
    const page = await browser.newPage();

    await page.goto(appConst.site.url);

    return {page, browser};
}
