// @flow

import {Page} from 'puppeteer';

import type {UserDataType} from './flow-types/user';

export const appConst = {
    window: {
        size: {
            width: 400,
            height: 620,
        },
    },
    url: {
        duel: '/duel',
        urfin: '/urfin',
        arena: '/survival',
    },
};

export async function refreshIFrameUrl(page: Page, userData: UserDataType) {
    console.log('---> refreshIFrameUrl');

    if (userData.iFrameUrl !== '') {
        return;
    }

    const url = page.url();

    await page.goto(userData.iFrameUrl);
    await page.waitFor(100);
    await page.goto(url);
    await page.waitFor(100);
}
