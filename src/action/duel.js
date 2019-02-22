// @flow

import type {Page, Browser} from 'puppeteer';

import {appConst} from '../const';
import {getUserFullHp} from '../script/user';

async function hasAvailableDuel(page: Page): Promise<boolean> {
    const button = await page.$('a[href="/duel/tobattle/"]');

    return Boolean(button);
}

async function isIntoDuel(page: Page): Promise<boolean> {
    const url = page.url();

    // check duel id
    const extraPart = url.replace(appConst.site.duel, '').replace('/\\/gi', '');

    return /\d{8,10}/.test(extraPart);
}

export async function duel(page: Page, browser: Browser) {
    await page.goto(appConst.site.duel);

    const currentHp = await getUserFullHp(page);

    console.log('---> current hp:', currentHp);

    if (await isIntoDuel(page)) {
        console.log('---> you into duel, fight!');
        return;
    }

    if (!hasAvailableDuel(page)) {
        console.log('---> NO available duel');
        return;
    }

    console.log('you can run fight');
}
