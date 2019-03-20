// @flow

/* global setTimeout */

import type {Browser, Page, InterceptedRequest} from 'puppeteer';
import puppeteer from 'puppeteer';

import type {UserDataType} from '../flow-types/user';
import {appConst} from '../const';
import {userList} from '../user-list';

const shellIntervalTimeout = 30 * 60 * 1000;

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

    // WARNING!!! see timeout in package.json/scrips/duel-int
    // setTimeout(() => {
    // browser.close();
    // do not use timeout in package.json/scrips/duel-int, let browser close
    // }, shellIntervalTimeout - 5e3);

    return {page, browser};
}
