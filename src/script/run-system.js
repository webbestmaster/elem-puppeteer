// @flow

import type {Browser, Page, InterceptedRequest} from 'puppeteer';
import puppeteer from 'puppeteer';

import type {UserDataType} from '../flow-types/user';
import {appConst} from '../const';
import {userList} from '../user-list';

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

    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on<InterceptedRequest>('request', blockImageRequest);

    await page.setViewport({width, height});

    return {page, browser};
}
