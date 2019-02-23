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

export async function findEnemyForDuel(page: Page, browser: Browser) {
    const currentHp = await getUserFullHp(page);

    const enemyHpRaw: string = await page.evaluate<string>(
        'document.querySelector(\'.c_da.mt5.mr5\').innerText'
    );

    const enemyHp = parseInt(enemyHpRaw.replace(/\D/gi, ''), 10);

    console.log('---> enemy hp:', enemyHp);

    if (enemyHp >= currentHp * 0.95) {
        await page.waitFor(1e3);
        await page.goto(page.url());
        await findEnemyForDuel(page, browser);
        return;
    }
}

async function doFight(page: Page, browser: Browser) {}

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

    await findEnemyForDuel(page, browser);

    await page.goto('/duel/tobattle/');

    console.log('you can run fight');
}
