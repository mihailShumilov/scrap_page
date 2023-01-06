import { Request, Response } from 'express';
// import { Queue } from 'bullmq';
import * as JSDiff from 'diff';



interface DiffResponse {
    status: string;
    diffs: JSDiff.Change[];
}

type DiffBuilder = (textLeft: string, textRight: string, socketId?: string, mode?: string, pretty?: boolean) => Promise<DiffResponse>;

const diffBuilder: DiffBuilder = async (textLeft, textRight, socketId, mode, pretty) => {
    // const queue = new Queue(process.env.SCRAP_QUEUE);
    // console.log({ url, callback, socketId, mode, pretty });
    // const job = await queue.add(process.env.SCRAP_JOB, { url, callback, socketId, mode, pretty });

    // TODO - add work with queue and create worker
    const diffs = JSDiff.diffLines(textLeft, textRight)
    return {
        status: "ok",
        diffs
    }
};

export const diffHandler = async (req: Request, res: Response) => {
    const { body } = req;
    const { textLeft, textRight} = body;
    const response = await diffBuilder(textLeft, textRight);

    return res.json(response);
};
