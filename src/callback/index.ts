import { Request, Response } from 'express';
import { Server } from "socket.io";


interface CallbackResponse {
    status: string;
}

type AcceptScrapeBuilder = (data: string, socketId?: string, io?: Server, mode?: string) => Promise<CallbackResponse>;

const callbackBuilder: AcceptScrapeBuilder = async (data, socketId, io, mode = 'full') => {
    io.to(socketId).emit('html', {data, mode});

    return {
        status: "ok"
    }
};

export const callbackHandler = async (req: Request, res: Response) => {
    const io = req.app.get('io');

    const { body } = req;
    const { data, socketId, mode } = body;

    const response = await callbackBuilder(data, socketId, io, mode);
    return res.json(response);
};
