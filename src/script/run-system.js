// @flow

import type {Browser, Page} from 'puppeteer';
import puppeteer from 'puppeteer';

import type {UserDataType} from '../flow-types/user';
import {appConst} from '../const';
import {userList} from '../user-list';

export async function runSystem(
    userData: UserDataType
): Promise<{ page: Page, browser: Browser }> {
    const {width, height} = appConst.window.size;

    const userIndex = userList.indexOf(userData);

    const leftPosition = userIndex * width * 0.8;

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        args: [
            `--window-size=${width},${height}`,
            `--window-position=${leftPosition},0`,
            '--disable-infobars',
            '--allow-insecure-localhost',
        ],
    });

    const page = await browser.newPage();

    await page.setViewport({width, height});

    return {page, browser};
}
