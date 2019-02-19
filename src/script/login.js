// @flow

import type {Page} from 'puppeteer';

const loginSelector = {
    loginLink: 'a[title="Вход для игроков"]',
    loginNameInput: 'input[name="plogin"]',
    loginPassInput: 'input[name="ppass"]',
    loginFormSubmitButton: 'input[type="submit"]',
};

export async function login(page: Page) {
    await page.click(loginSelector.loginLink);

    await page.type(loginSelector.loginNameInput, '');

    await page.type(loginSelector.loginPassInput, '');

    await page.click(loginSelector.loginFormSubmitButton);
}
