import { Request, Response } from 'express';


export const contactsParserPageHandler = (_req: Request, res: Response) => {
    return res.render('contactsParser/index')
};