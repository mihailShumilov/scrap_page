import { Request, Response } from 'express';
import { Queue } from 'bullmq';



interface AcceptScrapeResponse {
    status: string;
    jobId: string;
}

type AcceptScrapeBuilder = (url: string, callback: string) => Promise<AcceptScrapeResponse>;

const acceptScrapeBuilder: AcceptScrapeBuilder = async (url, callback) => {
    const queue = new Queue(process.env.SCRAP_QUEUE);
    const job = await queue.add(process.env.SCRAP_JOB, { url, callback });

    return {
        status: "ok",
        jobId: job.id
    }
};

export const acceptScrapeHandler = async (req: Request, res: Response) => {
    const { body } = req;
    const { url, callback } = body;
    const response = await acceptScrapeBuilder(url, callback);

    return res.json(response);
};
