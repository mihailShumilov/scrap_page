import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from "http";
import {acceptScrapeHandler} from "./acceptScrapeRequest";
import {homePageHandler} from "./pages/home";
import { Server } from "socket.io";
import path from "path";
import {callbackHandler} from "./callback";

const app = express();
const port = process.env.PORT || '8000';

app.use(express.json());
const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', homePageHandler);
app.post('/callback', callbackHandler);
app.post('/scrap/', acceptScrapeHandler);

const httpServer = createServer(app);
const io = new Server(httpServer,{});
app.set("io", io);

io.on("connection", (socket) => {
    console.log('Socket connection id ', socket.id);
});

httpServer.listen(port)
    .on('error' , err => {
    if (err) return console.error(err);
    return console.log(`Server is listening on ${port}`);
});

