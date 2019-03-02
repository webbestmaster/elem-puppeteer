// @flow

declare module 'puppeteer' {
    declare type PuppeteerHTMLElementType = {};

    declare type PageScreenshotOptionsType = {
        path: string,
    };

    declare class Page {
        goto(url: string): Promise<mixed>,
        screenshot(options: PageScreenshotOptionsType): Promise<mixed>,
        click(cssSelector: string): Promise<mixed>,
        type(cssSelector: string, text: string): Promise<mixed>,
        $(cssSelector: string): Promise<PuppeteerHTMLElementType | null>,
        evaluate<T>(funcOrStringFunc: ((() => T) | string)): Promise<T>,
        url(): string,
        waitFor(timeoutInMs: number): Promise<mixed>,
        setViewport(size: {width: number, height: number}): Promise<mixed>,
    }

    declare class Browser {
        newPage(): Promise<Page>,
        close(): Promise<mixed>,
    }

    declare type LaunchOptionsType = {
        headless?: boolean,
        slowMo?: number,
        args?: Array<string>, // example '--window-size=384,480'
    }

    declare function launch(launchOptions: LaunchOptionsType): Browser;
}
