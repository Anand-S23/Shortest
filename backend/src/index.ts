import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { pg_pool } from "./db";
import { rate_limiter } from "./middleware";
import { getURLs, postURL } from "./controller";

const app: Express = express();
app.use(express.json());
app.use(cors<Request>());

dotenv.config();

app.get('/', getURLs);
app.post('/', postURL);

app.get('/test', rate_limiter, (req: Request, res: Response) => {
    res.send("Test rate limiter");
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
