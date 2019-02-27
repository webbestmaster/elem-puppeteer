// @flow

import {Browser, Page} from 'puppeteer';

import {appConst} from '../const';

async function isArenaInBattle(page: Page): Promise<boolean> {
    let isInBattle: boolean = true;

    await page
        .evaluate<string>(
            'document.querySelector(\'img[src="/img/ico36-reload.png"]]\').getAttribute(\'src\')'
        )
        .catch(
            (): boolean => {
                isInBattle = false;
                return true;
            }
        );

    return isInBattle;
}

async function isArenaBattleEnd(page: Page): Promise<boolean> {
    return false;
}

async function isOnTitleArena(page: Page): Promise<boolean> {
    try {
        const headerName = await page.evaluate<string>(
            'document.querySelector(\'.bl.fttl.yell.cntr.mt5 .lf .rt\').innerText'
        );

        return headerName === 'Арена';
    } catch (error) {
        return false;
    }
}

async function joinIntoBattle(page: Page) {
    try {
        const href = await page.evaluate<string>(
            'document.querySelector(\'a.btn.w120px\').getAttribute(\'href\')'
        );

        page.goto(appConst.site.url + href);
    } catch (error) {
        console.log('you joined into battle');
    }

    await page.waitFor(1e3);
}

export async function arena(page: Page, browser?: Browser) {
    console.log('---> action: arena');

    await page.goto(appConst.site.arena);

    const isOnTitlePage = await isOnTitleArena(page);

    if (isOnTitlePage) {
        await joinIntoBattle(page);
        await arena(page);
        console.log('i am joined');
        return;
    }

    const isInBattle = await isArenaInBattle(page);

    if (isInBattle) {
        console.log('I am in battle');

        return;
    }

    const isBattleEnd = await isArenaBattleEnd(page);

    if (isBattleEnd) {
        // count battle and decide need more fight or not
        // if need more fight - run arena(page);
        return;
    }
}
