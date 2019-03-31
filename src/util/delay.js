// @flow

/* global setTimeout */

export async function delay(timeInMs: number) {
    await new Promise((resolve: () => void) => {
        setTimeout(resolve, timeInMs);
    });
}
