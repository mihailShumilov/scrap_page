import * as dotenv from 'dotenv';
dotenv.config();
import puppeteer from 'puppeteer';
import { Worker, Job } from 'bullmq';
import axios from 'axios';



(async () => {
    const browser = await puppeteer.launch({headless: false});

    const worker = new Worker(process.env.SCRAP_QUEUE, async (job: Job) => {
        const page = await browser.newPage();
        await page.setViewport({
            width  : 1440,
            height : 900
        });
        await page.goto(job.data.url, {waitUntil : 'domcontentloaded', timeout : 30000});
        // TODO: possible we need some 10-20 sec timeout here
        const data = await page.evaluate(() => document.querySelector('*').outerHTML);
        await page.close();

        await axios.post(job.data.callback, {html: data}, {timeout: 30000});

    },
        { concurrency: 10 });

    })();
