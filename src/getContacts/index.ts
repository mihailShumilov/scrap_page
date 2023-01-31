import {Request, Response} from 'express';
import * as cheerio from 'cheerio';
import {PageLoaderService} from "../service/pageLoader.service";


interface GetContactsResponse {
    status: string;
    result: ContactsData;
}

interface ContactsData {
    email?: string[];
    phone?: string[];
}

class GetContacts {

    private originText: string;

    private jsonData: ContactsData;

    private processor: cheerio.CheerioAPI;

    private readonly url: string;

    constructor(text: string, url: string) {
        this.originText = text;
        this.processor = cheerio.load(text);
        this.url = url;
        this.jsonData = {};
    }

    public build(): ContactsData {
        this.getPhoneNumbers();
        this.getEmails();

        return this.jsonData;
    }

    protected getPhoneNumbers() {
        const self = this;
        const phones: string[] = [];

        this.processor('a[href^="tel"]').each(function (i, elem) {
            const href = self.processor(this).attr('href')
            phones.push(href.replace('tel://', '').replace('tel:', ''));
        });

        const phoneRe = /(\(?\d{3}\)?[ \-]\d{3}[ \-]\d{4})/gmi;
        const phoneArrays = phoneRe.exec(this.originText);
        console.log({phoneArrays});
        if(phoneArrays) {
            for (const phone of phoneArrays) {
                phones.push(phone.replace(/\D/g, ''));
            }
        }

        console.log({phones});

        this.jsonData.phone = this.jsonData.phone || [];
        this.jsonData.phone.push(...new Set(phones));
    }

    protected getEmails(){
        const emails: string[] = [];
        const emailRe = /([a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum|me))/gmi;
        const emailArrays = emailRe.exec(this.originText);
        if(emailArrays) {
            for (const email of emailArrays) {
                emails.push(email.trim());
            }
        }

        this.jsonData.email = this.jsonData.email || [];
        this.jsonData.email.push(...new Set(emails));
    }
}

type GetContactsBuilder = (url: string, text?: string, socketId?: string) => Promise<GetContactsResponse>;

const getContactsBuilder: GetContactsBuilder = async (url: string, text: string, socketId?: any) => {
    if (!text) {
        const pageLoader = new PageLoaderService(url);
        await pageLoader.process();
        text = pageLoader.afterRenderHtml;
    }
    const getContacts = new GetContacts(text, url);

    return {
        status: "ok",
        result: getContacts.build()
    }
};

export const getContactsHandler = async (req: Request, res: Response) => {
    const {body} = req;
    const {text, url} = body;
    const response = await getContactsBuilder(url, text);

    return res.json(response);
};
