import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { redis_client } from "./db";
import { rate_limiter } from "./middleware";
import { rlTest, getURLs, postURL } from "./controller";

// Initalize App //

const app: Express = express();
app.use(express.json());
app.use(cors<Request>());

dotenv.config();

redis_client.on('connect', (err) => {
    if (err) {
        console.log('Could not establish a connection with Redis. ' + err);
    } else {
        console.log('Connected to Redis successfully!');
    }
});

// Routes //

app.get('/', getURLs);
app.post('/', postURL);
app.get('/test', rate_limiter, rlTest);

// Start Server //

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
