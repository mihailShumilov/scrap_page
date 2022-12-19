import { Request, Response } from 'express';

interface AcceptScrapeResponse {
    status: string;
}

type AcceptScrapeBuilder = (url: string, callback: string) => AcceptScrapeResponse;

const acceptScrapeBuilder: AcceptScrapeBuilder = (url, callback) => {
    return {
        status: "ok"
    }
};

export const acceptScrapeHandler = (req: Request, res: Response) => {
    const { body } = req;
    const { url, callback } = body;
    console.log({ url, callback });
    const response = acceptScrapeBuilder(url, callback);

    return res.json(response);
};
