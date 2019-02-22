// @flow

import puppeteer from 'puppeteer';

import {appConst} from './const';
import {login} from './script/login';
import {watch} from './script/watch';
import {runSystem} from './script/run-system';
import type {UserDataType} from './flow-types/user';

import {userList} from './user-list.js';

userList.forEach(async (userData: UserDataType) => {
    const {page, browser} = await runSystem();

    await login(page, userData);

    await watch(page, browser);

    await page.screenshot({path: './screenshot/site.png'});

    await browser.close();
});
