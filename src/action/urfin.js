// @flow

import type {Page, Browser} from 'puppeteer';

import {appConst} from '../const';

const maxAttackCount = 10;
const timeout = 100;

async function urfinStart(page: Page) {
    console.log('---> action: urfinStart');

    await page.goto(appConst.site.urfin + '/');
    await page.waitFor(timeout);

    await page.goto(appConst.site.urfin + '/next/');
    await page.waitFor(timeout);

    await page.goto(appConst.site.urfin + '/start/');
    await page.waitFor(timeout);
}

async function urfinFightGetLinkListByIndex(
    page: Page,
    index: number
): Promise<string> {
    console.log('---> function: urfinFightGetLinkListByIndex');

    return await page
        .evaluate<string>(
            `document.querySelector('.fb_path:nth-child(${index +
                1}) a').getAttribute('href')`
        )
        .catch(
            (error: Error): string => {
                console.log('can not find card with index:', index);
                return '';
            }
        );
}

async function urfinFightGetLinkList(page: Page): Promise<Array<string>> {
    console.log('---> function: urfinFightGetLinkList');

    const linkList = await Promise.all(
        [0, 1, 2].map(
            (index: number): Promise<string> =>
                urfinFightGetLinkListByIndex(page, index)
        )
    );

    return linkList.filter(Boolean);
}

async function isBattleEnd(page: Page): Promise<boolean> {
    const linkToNewBattle = await page
        .evaluate<string>(
            'document.querySelector(\'.btn.bli.mlra.w140px.sll\').getAttribute(\'href\')'
        )
        .catch((): string => '');

    return Boolean(linkToNewBattle);
}

async function getAttackCount(page: Page): Promise<number> {
    const errorCount = -1;

    try {
        const innerText = await page.evaluate<string>(
            'document.querySelector(\'.small.c_da.mt10.cntr\').innerText'
        );

        const match = innerText.match(/\d+/gi);

        if (!match) {
            return errorCount;
        }

        return parseInt(match[0], 10);
    } catch (error) {
        return errorCount;
    }
}

async function urfinFightToDie(page: Page) {
    console.log('---> action: urfinFightToDie');

    if (await isBattleEnd(page)) {
        await page.goto(appConst.site.urfin + '/');

        const attackCount = await getAttackCount(page);

        console.log('---> Urfin attack count:', attackCount);
        console.log('---> Max attack count:', maxAttackCount);

        if (attackCount < maxAttackCount) {
            await urfinFight(page);
        }
        return;
    }

    const linkList = await urfinFightGetLinkList(page);

    if (linkList.length === 0) {
        // press refresh button to show more cards
        await page.goto(appConst.site.urfin + '/battle/');
        await page.waitFor(timeout * 10);

        await urfinFightToDie(page);
        return;
    }

    await page.goto(appConst.site.url + linkList[0]);
    await page.waitFor(timeout);

    await urfinFightToDie(page);
}

async function urfinFight(page: Page) {
    console.log('---> action: urfinFight');

    await page.goto(appConst.site.urfin + '/start/confirmed/');
    await page.waitFor(timeout);

    await urfinFightToDie(page);
}

async function isUrfinInBattle(page: Page): Promise<boolean> {
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

export async function urfin(page: Page, browser?: Browser) {
    console.log('---> action: urfin');

    await urfinStart(page);
    await page.waitFor(timeout);

    if (await isUrfinInBattle(page)) {
        await urfinFightToDie(page);
        return;
    }

    const attackCount = await getAttackCount(page);

    console.log('---> Urfin attack count:', attackCount);
    console.log('---> Max attack count:', maxAttackCount);

    if (attackCount < maxAttackCount) {
        await urfinFight(page);
    }
}
