// @flow

/* global setTimeout */

import type {Browser, InterceptedRequest, Page} from 'puppeteer';
import puppeteer from 'puppeteer';

import type {UserDataType} from '../flow-types/user';
import {appConst} from '../const';
import {userList} from '../user-list';
import {getTimeout} from '../util/env';
import {delay} from '../util/delay';

function blockImageRequest(interceptedRequest: InterceptedRequest) {
    if (interceptedRequest.resourceType() === 'image') {
        interceptedRequest.abort();
        return;
    }
    interceptedRequest.continue();
}

export async function runSystem(
    userData: UserDataType
): Promise<{ page: Page, browser: Browser }> {
    const {width, height} = appConst.window.size;

    const userIndex = userList.indexOf(userData);

    const leftPosition = userIndex * width * 0.6;

    await delay(userIndex * 4e3);

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        args: [
            `--window-size=${width},${height}`,
            `--window-position=${leftPosition},0`,
            '--disable-infobars',
            '--allow-insecure-localhost',
            '--disable-gpu',
        ],
    });

    const [page] = await browser.pages();

    await page.setRequestInterception(true);

    page.on<InterceptedRequest>('request', blockImageRequest);

    await page.setViewport({width, height});

    const timeout = getTimeout();

    console.log('timeout:', timeout);

    if (timeout !== null) {
        setTimeout(() => {
            browser.close();
        }, timeout - 5e3);
    }

    return {page, browser};
}
