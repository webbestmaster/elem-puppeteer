// @flow

declare module 'shell-interval' {
    declare type ShellIntervalIOptionsType = {
        options: {
            command: string,
            time: number,
            reps: number,
            eager?: boolean,
            quiet?: boolean,
        },
        onExec: (error?: Error, stdout: string, stderr: string) => mixed,
        onFinish: () => mixed,
    }

    declare export default function shellInterval(options: ShellIntervalIOptionsType): void;
}
