// @flow

import type {Page, Browser} from 'puppeteer';

import {duel} from '../action/duel';
import {arena} from '../action/arena';
import {urfin} from '../action/urfin';

export async function watch(page: Page, browser: Browser) {
    try {
        await duel(page, browser);
    } catch (error) {
        console.error('---> ERROR: ! duel !');
        console.error('---> Page URL:', page.url());
        await page.screenshot({path: './screenshot/duel-error.png'});
        console.error(error);
    }

    /*
    try {
        await urfin(page, browser);
    } catch (error) {
        console.error('---> ERROR: ! urfin !');
        console.error('---> Page URL:', page.url());
        await page.screenshot({path: './screenshot/urfin-error.png'});
        console.error(error);
    }
    */

    /*
    try {
        await arena(page, browser);
    } catch (error) {
        console.error('---> ERROR: ! arena !');
        console.error('---> Page URL:', page.url());
        await page.screenshot({path: './screenshot/arena-error.png'});
        console.error(error);
    }
    */

    await page.waitFor(10e3);

    console.log('---> End of loop');
    console.log('---> Timeout 10 minutes');

    await page.waitFor(10 * 60e3); // 10 minutes

    await watch(page, browser);
}
