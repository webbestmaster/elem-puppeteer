// @flow

import type {Browser, Page} from 'puppeteer';
import puppeteer from 'puppeteer';

import type {UserDataType} from '../flow-types/user';
import {appConst} from '../const';

export async function runSystem(
    userData: UserDataType
): Promise<{ page: Page, browser: Browser }> {
    const {width, height} = appConst.window.size;

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        args: [`--window-size=${width},${height}`],
    });
    const page = await browser.newPage();

    await page.setViewport({width, height});

    return {page, browser};
}
