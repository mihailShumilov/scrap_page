import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {executablePath} from "puppeteer";

export class PageLoaderService {

    private readonly url: string;

    private _beforeRenderHtml: string;

    private _afterRenderHtml: string;

    constructor(url: string) {
        this.url = url;
    }

    public async process(): Promise<void> {
        try {
            puppeteer.use(StealthPlugin());
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox'],
                defaultViewport: null,
                executablePath: executablePath(),
            });
            const page = await browser.newPage();
            const response = await page.goto(this.url, {waitUntil: 'domcontentloaded', timeout: 30000});
            this._beforeRenderHtml = await response.text();
            await page.waitForTimeout(3 * 1000);
            this._afterRenderHtml = await page.evaluate(() => document.querySelector('*').outerHTML);
            await page.close();
            await browser.close();
        }catch (e) {
            console.error('ERROR: ', e);
        }
    }


    get beforeRenderHtml(): string {
        return this._beforeRenderHtml;
    }

    get afterRenderHtml(): string {
        return this._afterRenderHtml;
    }
}