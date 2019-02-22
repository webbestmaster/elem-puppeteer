// @flow

import type {Page, Browser} from 'puppeteer';

import {duel} from '../action/duel';

const toDoList = [duel];

export async function watch(page: Page, browser: Browser) {
    const chain = Promise.resolve();

    await toDoList[0](page, browser);

    /*
    toDoList.forEach(
        (func: (page: Page, browser: Browser) => Promise<mixed>) => {
            chain = chain.then((): Promise<mixed> => func(page, browser));
        }
    );
*/

    chain
        .then((): mixed => console.log('---> End of loop'))
        .catch(
            (error: Error): Error => {
                console.log('---> EXIT from WATCH with ERROR! <---');
                console.log(error);
                return error;
            }
        );
}
