// @flow

import shellInterval from 'shell-interval';

shellInterval({
    options: {
        command: 'cross-env TIMEOUT=30 babel-node ./src/main-duel.js',
        time: 30 * 60, // 30 minutes
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
