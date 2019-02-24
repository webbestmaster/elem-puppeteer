// @flow

/* global document */

import type {Page, Browser} from 'puppeteer';

export async function getUserFullHp(page: Page): Promise<number> {
    console.log('---> function: getUserFullHp');

    const defaultValue = '0';

    let result: string = await page
        .evaluate<string>(
            'document.querySelector(\'.ml5.mr3.pt2 .c_da\').innerText'
        )
        .catch(
            (): string => {
                console.log('---> can not get user hp from left top node');
                return defaultValue;
            }
        );

    if (result === defaultValue) {
        result = await page
            .evaluate<string>(
                'document.querySelector(\'#cur_user_hp\').innerText'
            )
            .catch(
                (): string => {
                    console.log(
                        '---> can not get user hp from right middle node (in duel)'
                    );
                    return '0';
                }
            );
    }

    let hpQ = 1;

    if (result.includes('K')) {
        hpQ = 1000;
    }

    return parseFloat(result.replace(/\s/, '')) * hpQ;
}
