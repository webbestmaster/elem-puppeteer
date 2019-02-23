// @flow

import type {Page, Browser} from 'puppeteer';

import {duel} from '../action/duel';

export async function watch(page: Page, browser: Browser) {
    await duel(page, browser);

    await page.waitFor(3e3);

    console.log('---> End of loop');

    await watch(page, browser);
}
