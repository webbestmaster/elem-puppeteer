// @flow

import {Browser, Page} from 'puppeteer';

import type {UserDataType} from '../flow-types/user';
import {appConst} from '../const';

async function isArenaInBattle(page: Page): Promise<boolean> {
    console.log('---> function: isArenaInBattle');

    let isInBattle: boolean = true;

    await page
        .evaluate<string>(
            'document.querySelector(\'img[src="/img/ico36-reload.png"]\').getAttribute(\'src\')'
        )
        .catch(() => {
            isInBattle = false;
        });

    console.log(isInBattle);

    return isInBattle;
}

async function isArenaBattleEnd(page: Page): Promise<boolean> {
    try {
        await page.evaluate<string>(
            'document.querySelector(\'.inbl.bg_black.plr5\').getAttribute(\'title\')'
        );

        return true;
    } catch (error) {
        return false;
    }
}

async function isOnTitleArena(page: Page): Promise<boolean> {
    console.log('---> function: isOnTitleArena');

    try {
        const headerName = await page.evaluate<string>(
            'document.querySelector(\'.bl.fttl.yell.cntr.mt5 .lf .rt\').innerText'
        );

        return headerName === 'Арена';
    } catch (error) {
        return false;
    }
}

async function joinIntoBattle(page: Page, userData: UserDataType) {
    console.log('---> action: joinIntoBattle');

    try {
        const href = await page.evaluate<string>(
            'document.querySelector(\'a.btn.w120px\').getAttribute(\'href\')'
        );

        page.goto(userData.siteUrl + href);
    } catch (error) {
        console.log('you joined into battle');
    }

    await page.waitFor(1e3);
}

async function isJoinedInBattle(
    page: Page,
    userData: UserDataType
): Promise<boolean> {
    try {
        // check join link
        await page.evaluate<string>(
            'document.querySelector(\'a[href^="/survival/join/"]\').getAttribute(\'href\')'
        );

        // check refresh link
        await page.evaluate<string>(
            'document.querySelector(\'a[href="/survival/"]\').getAttribute(\'href\')'
        );

        return false;
    } catch (error) {
        return true;
    }
}

export async function arena(page: Page, userData: UserDataType) {
    console.log('---> action: arena');

    await page.goto(userData.siteUrl + appConst.url.arena);

    const isOnTitlePage = await isOnTitleArena(page);

    if (isOnTitlePage) {
        if (await isJoinedInBattle(page, userData)) {
            console.log('i am joined');
        } else {
            await joinIntoBattle(page, userData);
        }

        await page.waitFor(1e3);
        await arena(page, userData);
        return;
    }

    await page.waitFor(1e3);

    const isInBattle = await isArenaInBattle(page);

    if (isInBattle) {
        console.log('I am in battle');

        await arena(page, userData);
        return;
    }

    const isBattleEnd = await isArenaBattleEnd(page);

    if (isBattleEnd) {
        await arena(page, userData);
        return;
    }
}
