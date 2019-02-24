// @flow

import type {Page, Browser} from 'puppeteer';

import {duel} from '../action/duel';

export async function watch(page: Page, browser: Browser) {
    await duel(page, browser);

    console.log('---> End of loop');
    console.log('---> Timeout 10 minutes');

    await page.waitFor(10 * 60e3); // 10 minutes

    await watch(page, browser);
}
