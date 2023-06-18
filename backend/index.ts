import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Pool } from 'pg';

dotenv.config();

const app: Express = express();
app.use(cors<Request>());
app.use(express.json());

const port = process.env.PORT || 3001;

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password123',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: 5432,
    database: process.env.POSTGRES_DB || 'shortest_db'
});

app.get('/', (req: Request, res: Response) => {
    pool.query('SELECT * FROM shortest', (error, results) => {
        if (error) {
            res.status(500).json({'error': 'Error occured with database'});
        }

        res.status(200).json(results.rows);
    });
});

app.post('/', (req: Request, res: Response) => {
    console.log(req.body);
    res.json(req.body);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
