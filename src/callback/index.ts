import { Request, Response } from 'express';
import { Server } from "socket.io";


interface CallbackResponse {
    status: string;
}

type AcceptScrapeBuilder = (data: string, socketId?: string, io?: Server) => Promise<CallbackResponse>;

const callbackBuilder: AcceptScrapeBuilder = async (data, socketId, io) => {
    io.to(socketId).emit('html', data);

    return {
        status: "ok"
    }
};

export const callbackHandler = async (req: Request, res: Response) => {
    const io = req.app.get('io');

    const { body } = req;
    const { data, socketId } = body;

    const response = await callbackBuilder(data, socketId, io);
    return res.json(response);
};
