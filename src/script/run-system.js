// @flow

import puppeteer from 'puppeteer';

import type {Page, Browser} from 'puppeteer';

import type {UserDataType} from '../flow-types/user';

export async function runSystem(
    userData: UserDataType
): Promise<{ page: Page, browser: Browser }> {
    const browser = await puppeteer.launch({headless: false, slowMo: 50});
    const page = await browser.newPage();

    return {page, browser};
}
