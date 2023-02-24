import * as dotenv from 'dotenv';

dotenv.config();
import {executablePath} from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {Worker, Job} from 'bullmq';
import axios from 'axios';
import pretty from 'pretty';
import {JSDOM} from "jsdom";
import {Readability} from "@mozilla/readability";


(async () => {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-zygote',
        ],
        defaultViewport: null,
        executablePath: executablePath(),
        ignoreHTTPSErrors: true,
    });

    const worker = new Worker(process.env.SCRAP_QUEUE, async (job: Job) => {
            console.log('job.data: ', job.data);
            const page = await browser.newPage();
            // await page.setViewport({
            //     width: 1440,
            //     height: 900
            // });
            const response = await page.goto(job.data.url, {
                waitUntil: job.data?.mode && job.data.mode === 'short' ? 'domcontentloaded' : ['load', 'networkidle2'],
                timeout: 30000
            });
            // await page.waitForTimeout(10 * 1000);
            let data: string|object = await page.evaluate(() => document.querySelector('*').outerHTML);
            if (job.data?.mode && job.data.mode === 'short') {
                data = await response.text();
            }
            if (job.data?.mode && job.data.mode === 'reader') {
                const doc = new JSDOM(data);
                const reader = new Readability(doc.window.document);
                data = reader.parse();
            } else {
                if (job.data.pretty === true) {
                    data = pretty(data);
                }
            }
            await page.close();
            console.log('start callback: ', job.data.callback);
            await axios.post(job.data.callback, {
                data,
                socketId: job.data.socketId,
                mode: job.data.mode,
                url: job.data.url
            }, {timeout: 30000});
            console.log('finish callback: ', job.data.callback);
        },
        {concurrency: 10});

})();
