// @flow

import shellInterval from 'shell-interval';

shellInterval({
    options: {
        command: 'babel-node ./src/main-duel.js',
        time: 30,
        reps: 5,
        eager: true,
    },
    onExec(error?: Error, stdout: string, stderr: string) {
        if (error) {
            throw error;
        }

        console.log(stdout);
    },
    onFinish() {
        console.log('The shell command was called several times. Exiting...');
    },
});
