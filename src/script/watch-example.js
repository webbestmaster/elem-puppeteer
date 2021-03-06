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
        await page.screenshot({path: './screenshot/example-duel-error.png'});
        console.error(error);
    }

    try {
        await urfinHandle(page, userData);
    } catch (error) {
        console.error('---> ERROR: ! urfin ! Page URL:', page.url());
        await page.screenshot({
            path: './screenshot/example-urfin-handle-error.png',
        });
        console.error(error);
    }

    try {
        await arena(page, userData);
    } catch (error) {
        console.error('---> ERROR: ! arena ! Page URL:', page.url());
        await page.screenshot({path: './screenshot/example-arena-error.png'});
        console.error(error);
    }

    await page.waitFor(10e3);

    console.log('---> End of loop');
    console.log('---> Timeout 5 seconds');

    await page.waitFor(5e3); // 5 seconds

    await watch(page, userData);
}
