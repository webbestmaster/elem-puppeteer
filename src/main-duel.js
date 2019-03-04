// @flow

import type {Page} from 'puppeteer';

import {login} from './script/login';
import {runSystem} from './script/run-system';
import type {UserDataType} from './flow-types/user';
import {userList} from './user-list.js';
import {duel} from './action/duel';

async function watch(page: Page, userData: UserDataType) {
    try {
        await duel(page, userData);
    } catch (error) {
        console.error('---> ERROR: ! urfin !');
        console.error('---> Page URL:', page.url());
        await page.screenshot({path: './screenshot/duel-error.png'});
        console.error(error);
    }

    if (userData.iFrameUrl !== '') {
        // refresh mailSru's session
        await page.goto(userData.iFrameUrl);
    }

    await page.waitFor(10e3);

    console.log('---> End of loop');
    console.log('---> Timeout 1 minutes');

    await page.waitFor(60e3); // 1 minute

    await watch(page, userData);
}

async function run(userData: UserDataType) {
    const {page, browser} = await runSystem(userData);

    if (userData.iFrameUrl) {
        await page.goto(userData.iFrameUrl);
    } else {
        await page.goto(userData.siteUrl);
        await login(page, userData);
    }

    await watch(page, userData);

    await page.screenshot({path: './screenshot/duel.png'});

    await browser.close();
}

userList.forEach(run);
