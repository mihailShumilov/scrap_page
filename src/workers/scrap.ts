import * as dotenv from 'dotenv';

dotenv.config();
import {executablePath} from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {Worker, Job} from 'bullmq';
import axios from 'axios';


(async () => {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
        defaultViewport: null,
        executablePath: executablePath(),
    });

    const worker = new Worker(process.env.SCRAP_QUEUE, async (job: Job) => {
            const page = await browser.newPage();
            // await page.setViewport({
            //     width: 1440,
            //     height: 900
            // });
            await page.goto(job.data.url, {waitUntil: 'domcontentloaded', timeout: 30000});
            await page.waitForTimeout(10*1000);
            const data = await page.evaluate(() => document.querySelector('*').outerHTML);
            await page.close();
            console.log('start callback: ', job.data.callback);
            await axios.post(job.data.callback, {data, socketId: job.data.socketId}, {timeout: 30000});
            console.log('finish callback: ', job.data.callback);
        },
        {concurrency: 10});

})();
