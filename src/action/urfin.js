// @flow

import type {Page, Browser} from 'puppeteer';

import {appConst} from '../const';

async function urfinStart(page: Page) {
    console.log('---> action: urfinStart');

    await page.goto(appConst.site.urfin + '/');
    await page.waitFor(1e3);

    await page.goto(appConst.site.urfin + '/next/');
    await page.waitFor(1e3);

    await page.goto(appConst.site.urfin + '/start/');
    await page.waitFor(1e3);
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

async function urfinFightToDie(page: Page) {
    console.log('---> action: urfinFightToDie');

    if (await isBattleEnd(page)) {
        await page.goto(appConst.site.urfin + '/');
        // TODO: check count of attack and attack if needed
        // urfinFight() to more attack
        return;
    }

    const linkList = await urfinFightGetLinkList(page);

    if (linkList.length === 0) {
        // press refresh button to show more cards
        await page.goto(appConst.site.urfin + '/battle/');
        await page.waitFor(1e3);

        await urfinFightToDie(page);
        return;
    }

    await page.goto(appConst.site.url + linkList[0]);
    await page.waitFor(1e3);

    await urfinFightToDie(page);
}

async function urfinFight(page: Page) {
    console.log('---> action: urfinFight');

    await page.goto(appConst.site.urfin + '/start/confirmed/');
    await page.waitFor(1e3);

    await urfinFightToDie(page);
}

export async function urfin(page: Page, browser?: Browser) {
    console.log('---> action: urfin');

    await urfinStart(page);
    await page.waitFor(1e3);

    await urfinFight(page);
}
