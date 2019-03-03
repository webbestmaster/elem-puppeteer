// @flow

import type {Browser, Page} from 'puppeteer';

import {appConst} from '../const';
import type {UserDataType} from '../flow-types/user';

import {urfinFightGetLinkList} from './urfin-handle';

const timeout = 100;

async function getAutoLink(page: Page): Promise<string> {
    try {
        return await page.evaluate<string>(
            'document.querySelector(\'a[href^="/urfin/auto/"]\').getAttribute(\'href\')'
        );
    } catch (error) {
        return '';
    }
}

async function getAutoLinkConfirmed(page: Page): Promise<string> {
    try {
        return await page.evaluate<string>(
            'document.querySelector(\'a.green[href^="/urfin/auto/"]\').getAttribute(\'href\')'
        );
    } catch (error) {
        return '';
    }
}

async function urfinStart(page: Page, userData: UserDataType) {
    console.log('---> action: urfinStart');

    await page.goto(userData.siteUrl + appConst.url.urfin + '/');
    await page.waitFor(timeout);
}

/*
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
*/

/*
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
*/

/*
async function isBattleEnd(page: Page): Promise<boolean> {
    const linkToNewBattle = await page
        .evaluate<string>(
            'document.querySelector(\'.btn.bli.mlra.w140px.sll\').getAttribute(\'href\')'
        )
        .catch((): string => '');

    return Boolean(linkToNewBattle);
}
*/

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

/*
async function urfinFightToDie(page: Page, userData: UserDataType) {
    console.log('---> action: urfinFightToDie');

    if (await isBattleEnd(page)) {
        await page.goto(userData.siteUrl + appConst.url.urfin + '/');

        const attackCount = await getAttackCount(page);

        console.log('---> Urfin attack count:', attackCount);
        console.log(
            '---> Max attack count auto:',
            userData.urfin.maxHandleAttack
        );

        if (attackCount < userData.urfin.maxHandleAttack) {
            await urfinAutoFight(page, userData);
        }
        return;
    }

    const linkList = await urfinFightGetLinkList(page);

    if (linkList.length === 0) {
        // press refresh button to show more cards
        await page.goto(userData.siteUrl + appConst.url.urfin + '/battle/');
        await page.waitFor(timeout * 10);

        await urfinFightToDie(page, userData);
        return;
    }

    await page.goto(userData.siteUrl + linkList[0]);
    await page.waitFor(timeout);

    await urfinFightToDie(page, userData);
}
*/

async function urfinAutoFight(page: Page, userData: UserDataType) {
    console.log('---> action: urfinAutoFight');

    const autoLink = await getAutoLink(page);

    await page.goto(userData.siteUrl + autoLink);
    await page.waitFor(timeout);

    const autoLinkConfirmed = await getAutoLinkConfirmed(page);

    await page.goto(userData.siteUrl + autoLinkConfirmed);
    await page.waitFor(timeout);
}

/*
async function isUrfinInBattle(page: Page): Promise<boolean> {
    let isInBattle: boolean = true;

    await page
        .evaluate<string>(
            'document.querySelector(\'img[src="/img/ico36-reload.png"]\').getAttribute(\'src\')'
        )
        .catch(
            (): boolean => {
                isInBattle = false;
                return true;
            }
        );

    return isInBattle;
}
*/

async function isHandOnlyWay(page: Page): Promise<boolean> {
    try {
        // check auto link
        await page.evaluate<string>(
            'document.querySelector(\'a[href^="/urfin/auto/"]\').getAttribute(\'href\')'
        );

        // check handle link
        await page.evaluate<string>(
            'document.querySelector(\'a[href="/urfin/start/"]\').getAttribute(\'href\')'
        );

        return false;
    } catch (error) {
        return true;
    }
}

async function isBattleEnd(page: Page): Promise<boolean> {
    const linkToNewBattle = await page
        .evaluate<string>(
            'document.querySelector(\'.btn.bli.mlra.w140px.sll\').getAttribute(\'href\')'
        )
        .catch((): string => '');

    return Boolean(linkToNewBattle);
}

async function urfinFightToDie(page: Page, userData: UserDataType) {
    console.log('---> action: urfinFightToDie');

    if (await isBattleEnd(page)) {
        await urfinStart(page, userData);
        return;
    }

    const linkList = await urfinFightGetLinkList(page);

    if (linkList.length === 0) {
        // press refresh button to show more cards
        await page.goto(userData.siteUrl + appConst.url.urfin + '/battle/');
        await page.waitFor(timeout * 10);

        await urfinFightToDie(page, userData);
        return;
    }

    await page.goto(userData.siteUrl + linkList[0]);
    await page.waitFor(timeout);

    await urfinFightToDie(page, userData);
}

async function handleFight(page: Page, userData: UserDataType) {
    try {
        await page.goto(userData.siteUrl + appConst.url.urfin + '/start/');
        await page.waitFor(timeout);

        await urfinFightToDie(page, userData);
    } catch (error) {
        console.log(error);
    }
}

export async function urfinAuto(page: Page, userData: UserDataType) {
    console.log('---> action: urfin');

    await urfinStart(page, userData);
    await page.waitFor(timeout);

    if (await isHandOnlyWay(page)) {
        await handleFight(page, userData);
        await urfinAuto(page, userData);
        return;
    }

    const attackCount = await getAttackCount(page);

    console.log('---> Urfin attack count:', attackCount);
    console.log('---> Max attack count auto:', userData.urfin.maxAutoAttack);

    if (attackCount < userData.urfin.maxAutoAttack) {
        await urfinAutoFight(page, userData);
        await urfinAuto(page, userData);
    }
}
