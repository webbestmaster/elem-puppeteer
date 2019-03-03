// @flow

import type {Browser, Page} from 'puppeteer';

import {duel} from '../action/duel';
import type {UserDataType} from '../flow-types/user';
import {urfinHandle} from '../action/urfin-handle';
import {arena} from '../action/arena';

export async function watch(page: Page, userData: UserDataType) {
    try {
        await duel(page, userData);
    } catch (error) {
        console.error('---> ERROR: ! duel ! Page URL:', page.url());
        await page.screenshot({path: './screenshot/duel-error.png'});
        console.error(error);
    }

    try {
        await urfinHandle(page, userData);
    } catch (error) {
        console.error('---> ERROR: ! urfin ! Page URL:', page.url());
        await page.screenshot({path: './screenshot/urfin-error.png'});
        console.error(error);
    }

    try {
        await arena(page, userData);
    } catch (error) {
        console.error('---> ERROR: ! arena ! Page URL:', page.url());
        await page.screenshot({path: './screenshot/arena-error.png'});
        console.error(error);
    }

    await page.waitFor(10e3);

    console.log('---> End of loop');
    console.log('---> Timeout 1 minutes');

    await page.waitFor(60e3); // 1 minute

    await watch(page, userData);
}
