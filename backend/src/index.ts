import express, { Express, Request } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { redis_client } from "./db";
import { rate_limiter } from "./middleware";
import { getURLs, postURL } from "./controller";

// Initalize App //

const app: Express = express();
app.use(express.json());
app.use(cors<Request>());

dotenv.config();

(async () => { await redis_client.connect() })();

// Routes //

app.get('/', getURLs);
app.post('/', rate_limiter, postURL);

// Start Server //

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`⚡️[server]: Server running on port ${port}`);
});
