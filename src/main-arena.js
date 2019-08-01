// @flow

import type {Page} from 'puppeteer';

import {login} from './script/login';
import {runSystem} from './script/run-system';
import type {UserDataType} from './flow-types/user';
import {userList} from './user-list.js';
import {arena} from './action/arena';
import {refreshIFrameUrl} from './const';

async function watch(page: Page, userData: UserDataType) {
    try {
        await arena(page, userData);
    } catch (error) {
        console.error('---> ERROR: ! urfin !');
        console.error('---> Page URL:', page.url());
        await page.screenshot({path: './screenshot/arena-error.png'});
        console.error(error);
    }

    await refreshIFrameUrl(page, userData);

    await page.waitFor(1e3);

    console.log('---> End of loop');
    console.log('---> Timeout 1 second');

    await page.waitFor(1e3); // 1 seconds

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

    await page.screenshot({path: './screenshot/arena.png'});

    await browser.close();
}

userList.forEach(run);
