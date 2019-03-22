// @flow

import shellInterval from 'shell-interval';

import {appConst} from './const';

const timeout = 25 * 60; // in seconds, here is 25 minutes;

shellInterval({
    options: {
        command: `cross-env TIMEOUT=${timeout} babel-node ./src/main-arena.js`,
        time: timeout,
        reps: appConst.interval.main,
        eager: true,
    },
    onExec(error: Error | null, stdout: string, stderr: string) {
        if (error) {
            console.log(error.message);
        }

        console.log('shellInterval - onExec:', stdout);
    },
    onFinish() {
        console.log('The shell command was called several times. Exiting...');
    },
});
