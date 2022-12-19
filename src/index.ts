import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { helloHandler } from './handlers';
import {acceptScrapeHandler} from "./acceptScrapeRequest";
import {homePageHandler} from "./pages/home";
import path from "path";

const app = express();
const port = process.env.PORT || '8000';

app.use(express.json());
const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.get('/', homePageHandler);
app.get('/hello/:name', helloHandler);
app.post('/scrap/', acceptScrapeHandler)

app.listen(port)
    .on('error' , err => {
    if (err) return console.error(err);
    return console.log(`Server is listening on ${port}`);
});