import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { rootHandler, helloHandler } from './handlers';
import {acceptScrapeHandler} from "./acceptScrapeRequest";

const app = express();
const port = process.env.PORT || '8000';

app.use(express.json());


app.get('/', rootHandler);
app.get('/hello/:name', helloHandler);
app.post('/scrap/', acceptScrapeHandler)

app.listen(port)
    .on('error' , err => {
    if (err) return console.error(err);
    return console.log(`Server is listening on ${port}`);
});