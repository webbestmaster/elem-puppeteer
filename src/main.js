// @flow

import type {Page} from 'puppeteer';

import {login} from './script/login';
import {watch} from './script/watch';
import {runSystem} from './script/run-system';
import type {UserDataType} from './flow-types/user';
import {userList} from './user-list.js';

async function run(userData: UserDataType) {
    const {page, browser} = await runSystem(userData);

    if (userData.iFrameUrl) {
        await page.goto(userData.iFrameUrl);
    } else {
        await page.goto(userData.site.url);
        await login(page, userData);
    }

    await watch(page, userData);

    await page.screenshot({path: './screenshot/site.png'});

    await browser.close();
}

userList.forEach(run);
