import { Request, Response } from 'express';


export const homePageHandler = (_req: Request, res: Response) => {
    return res.render('home/index')
};