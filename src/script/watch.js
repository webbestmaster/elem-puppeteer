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
        .then(
            async (): mixed => {
                console.log('---> End of loop');
                await page.waitFor(3e3);
                return watch(page, browser);
            }
        )
        .catch(
            async (error: Error): Promise<Error> => {
                console.log('---> EXIT from WATCH with ERROR! <---');
                console.log(error);

                await page.waitFor(3e3);
                await watch(page, browser);

                return error;
            }
        );
}
