// @flow

import type {Page, Browser} from 'puppeteer';

import {appConst} from '../const';
import {getUserFullHp} from '../script/user';

async function hasAvailableDuel(page: Page): Promise<boolean> {
    console.log('---> function: hasAvailableDuel');

    const button = await page.$('a[href="/duel/tobattle/"]');

    return Boolean(button);
}

async function isIntoDuel(page: Page): Promise<boolean> {
    console.log('---> function: isIntoDuel');

    if (await isEndOfDuel(page)) {
        return false;
    }

    return /duel\/\d{8,10}/.test(page.url());
}

async function isEndOfDuel(page: Page): Promise<boolean> {
    console.log('---> function: isEndOfDuel');

    const isNeededUrl = /duel\/\d{8,10}/.test(page.url());

    if (isNeededUrl === false) {
        return false;
    }

    const messagesLength: string | number = await page.evaluate<
        string | number
    >('document.querySelectorAll(\'.nm_txt_in\').length');

    return parseInt(messagesLength, 10) === 1;
}

export async function findEnemyForDuel(page: Page) {
    console.log('---> action: findEnemyForDuel');

    const hpQ = 1;

    const currentHp = await getUserFullHp(page);

    const enemyHpRaw: string = await page.evaluate<string>(
        'document.querySelector(\'.c_da.mt5.mr5\').innerText'
    );

    const enemyHp = parseInt(enemyHpRaw.replace(/\D/gi, ''), 10);

    console.log('---> enemy hp:', enemyHp);

    if (enemyHp >= currentHp * hpQ) {
        await page.waitFor(1e3);
        await page.goto(page.url());
        await findEnemyForDuel(page);
        return;
    }
}

type DuelPairCardType = {|
    +attack: number,
    +reverse: number,
    +ratio: number,
    +index: number,
|};

type DuelAttackResultType = {|
    +damage: {|
        +given: number,
        +received: number,
    |},
    +result: number,
|};

function getAttackResult(cardPair: DuelPairCardType): DuelAttackResultType {
    console.log('---> function: getAttackResult');

    const given = cardPair.attack * cardPair.ratio;

    let received = cardPair.reverse;

    if (cardPair.ratio === 1.5) {
        received *= 0.5;
    }

    if (cardPair.ratio === 0.5) {
        received *= 1.5;
    }

    return {
        damage: {
            given,
            received,
        },
        result: given - received,
    };
}

async function getDuelPairCardDataByCardNumber(
    index: number,
    page: Page
): Promise<DuelPairCardType> {
    console.log('---> function: getDuelPairCardDataByCardNumber');

    const attackRaw: string = await page.evaluate<string>(
        `document.querySelector('.fb_path:nth-child(${index +
            1}) .card.active.at .stat').innerText`
    );

    const reverseRaw: string = await page.evaluate<string>(
        `document.querySelector('.fb_path:nth-child(${index +
            1}) .card.chide66.at .stat').innerText`
    );

    const ratioRaw: string = await page.evaluate<string>(
        `document.querySelector('.fb_path:nth-child(${index +
            1}) .dmg_coef span').innerText`
    );

    return {
        attack: parseInt(attackRaw.replace(/\D/gi, ''), 10),
        reverse: parseInt(reverseRaw.replace(/\D/gi, ''), 10),
        ratio: parseFloat(ratioRaw.trim()),
        index,
    };
}

async function getDuelPairCardList(
    page: Page
): Promise<Array<DuelPairCardType>> {
    console.log('---> function: getDuelPairCardList');

    return await Promise.all(
        [0, 1, 2].map(
            (index: number): Promise<DuelPairCardType> =>
                getDuelPairCardDataByCardNumber(index, page)
        )
    );
}

async function doDuelFight(page: Page) {
    console.log('---> action: doDuelFight');

    const duelCardList = await getDuelPairCardList(page);

    const pairCard = duelCardList.sort(
        (pair1: DuelPairCardType, pair2: DuelPairCardType): number => {
            return (
                getAttackResult(pair2).result - getAttackResult(pair1).result
            );
        }
    )[0];

    const newFightUrl: string = await page.evaluate<string>(
        `document.querySelector('.fb_path:nth-child(${pairCard.index +
            1}) a').getAttribute('href')`
    );

    await page.goto(appConst.site.url + newFightUrl);

    await page.waitFor(1e3);

    if (await isIntoDuel(page)) {
        console.log('---> you into duel, fight!');
        await doDuelFight(page);
        return;
    }

    console.log('---> end of duel!');

    await page.waitFor(1e3);
}

// eslint-disable-next-line max-statements
export async function duel(page: Page, browser?: Browser) {
    console.log('---> action: duel');

    await page.goto(appConst.site.duel);

    const currentHp = await getUserFullHp(page);

    console.log('---> current hp:', currentHp);

    if (await isEndOfDuel(page)) {
        console.log('---> action: duel ---> isEndOfDuel');
        await page.waitFor(1e3);
        await page.goto(appConst.site.duel);
        return;
    }

    if (await isIntoDuel(page)) {
        console.log('---> you into duel, fight!');
        await doDuelFight(page);
        return;
    }

    if (!await hasAvailableDuel(page)) {
        console.log('---> NO available duel');
        return;
    }

    await findEnemyForDuel(page);

    console.log('---> action: duel ---> findEnemyForDuel');

    await page.goto(appConst.site.duel + '/tobattle/');

    await page.waitFor(1e3);

    await doDuelFight(page);

    await page.waitFor(1e3);

    console.log('---> doDuelFight is over');
    console.log('---> Start new duel process');

    await duel(page);
}
