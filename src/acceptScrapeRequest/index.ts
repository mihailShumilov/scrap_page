import { Request, Response } from 'express';
import { Queue } from 'bullmq';



interface AcceptScrapeResponse {
    status: string;
    jobId: string;
}

type AcceptScrapeBuilder = (url: string, callback: string, socketId?: string) => Promise<AcceptScrapeResponse>;

const acceptScrapeBuilder: AcceptScrapeBuilder = async (url, callback, socketId) => {
    const queue = new Queue(process.env.SCRAP_QUEUE);
    console.log({ url, callback, socketId });
    const job = await queue.add(process.env.SCRAP_JOB, { url, callback, socketId });

    return {
        status: "ok",
        jobId: job.id
    }
};

export const acceptScrapeHandler = async (req: Request, res: Response) => {
    const { body } = req;
    const { url, callback, socketId } = body;
    const response = await acceptScrapeBuilder(url, callback, socketId);

    return res.json(response);
};
