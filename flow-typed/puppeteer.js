// @flow

declare module 'puppeteer' {
    declare type PageScreenshotOptionsType = {
        path: string,
    };

    declare class Page {
        goto(url: string): Promise<mixed>,
        screenshot(options: PageScreenshotOptionsType): Promise<mixed>,
        click(cssSelector: string): Promise<mixed>,
        type(cssSelector: string, text: string): Promise<mixed>,
    }

    declare class Browser {
        newPage(): Promise<Page>,
        close(): Promise<mixed>,
    }

    declare type LaunchOptionsType = {
        headless?: boolean,
        slowMo?: number,
    }

    declare function launch(launchOptions: LaunchOptionsType): Browser;
}
