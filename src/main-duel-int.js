// @flow

import shellInterval from 'shell-interval';

const timeout = 25 * 60; // in seconds, here is 25 minutes;

shellInterval({
    options: {
        command: `cross-env TIMEOUT=${timeout} babel-node ./src/main-duel.js`,
        time: timeout,
        reps: 5,
        eager: true,
    },
    onExec(error: Error | null, stdout: string, stderr: string) {
        if (error) {
            throw error;
        }

        console.log('shellInterval - onExec:', stdout);
    },
    onFinish() {
        console.log('The shell command was called several times. Exiting...');
    },
});
