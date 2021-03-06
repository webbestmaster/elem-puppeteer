// @flow

import type {Page} from 'puppeteer';

import type {UserDataType} from '../flow-types/user';

const loginSelector = {
    loginLink: 'a[title="Вход для игроков"]',
    loginNameInput: 'input[name="plogin"]',
    loginPassInput: 'input[name="ppass"]',
    loginFormSubmitButton: 'input[type="submit"]',
};

export async function login(page: Page, userData: UserDataType) {
    const {login: userLogin, password} = userData;

    if (userLogin && password) {
        console.log('login with login/password');

        // await page.click(loginSelector.loginLink);

        await page.goto(userData.siteUrl + '/login');

        await page.type(loginSelector.loginNameInput, userLogin);

        await page.type(loginSelector.loginPassInput, password);

        await page.click(loginSelector.loginFormSubmitButton);

        return;
    }

    throw new Error('Login and Pass needed');
}
