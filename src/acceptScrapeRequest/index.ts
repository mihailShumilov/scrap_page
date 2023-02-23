import { Request, Response } from 'express';
import { Queue } from 'bullmq';



interface AcceptScrapeResponse {
    status: string;
    jobId: string;
}

type AcceptScrapeBuilder = (url: string, callback: string, socketId?: string, mode?: string, pretty?: boolean) => Promise<AcceptScrapeResponse>;

const acceptScrapeBuilder: AcceptScrapeBuilder = async (url, callback, socketId, mode = 'full', pretty = true) => {
    const queue = new Queue(process.env.SCRAP_QUEUE);
    console.log({ url, callback, socketId, mode, pretty });
    const job = await queue.add(process.env.SCRAP_JOB, { url, callback, socketId, mode, pretty });
    await queue.close();
    return {
        status: "ok",
        jobId: job.id
    }
};

export const acceptScrapeHandler = async (req: Request, res: Response) => {
    const { body } = req;
    const { url, callback, socketId, mode, pretty } = body;
    const response = await acceptScrapeBuilder(url, callback, socketId, mode, pretty);

    return res.json(response);
};
