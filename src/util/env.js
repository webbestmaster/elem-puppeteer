// @flow

/* global process */

function getEnv(): mixed {
    // eslint-disable-next-line no-process-env
    return process && typeof process === 'object' ? process.env : {};
}

export function getTimeout(): number | null {
    const env: mixed = getEnv();
    const timeout: mixed = env && typeof env === 'object' ? env.TIMEOUT : null;

    if (timeout === null) {
        return null;
    }

    return parseInt(timeout, 10) * 1e3;
}
