import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Pool } from 'pg';
import sha256 from 'crypto-js/sha256';

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

const query = async (query: string, params: any[]) => {
    const {rows, fields} = await pool.query(query, params);
    return rows;
}

app.get('/', (req: Request, res: Response) => {
    pool.query('SELECT * FROM shortest', (error, results) => {
        if (error) {
            res.status(500).json({'error': 'Error occured with database'});
        }
        res.status(200).json(results.rows);
    });
});

app.post('/', async (req: Request, res: Response) => {
    const { url } = req.body;
    const long_duplicate = await query(
        'SELECT * FROM shortest WHERE long_url = $1', [url]);

    if (long_duplicate.length > 0) {
        return res.json(long_duplicate[0]);
    }

    const hashed_url = sha256(url).toString();
    let short_hash = hashed_url.substring(0, 6);

    let short_duplicate = await query(
        'SELECT * FROM shortest WHERE short_hash = $1', [short_hash]);

    let current_sub = 6;
    while (short_duplicate.length > 0) {
        short_hash = hashed_url.substring(0, current_sub++);
        short_duplicate = await query(
            'SELECT * FROM shortest WHERE short_hash = $1', [short_hash]);
    }

    const insert_result = await query(
        'INSERT INTO shortest (long_url, short_hash, visit_count)' +
        'VALUES ($1, $2, $3)' +
        'RETURNING short_hash, visit_count',
        [url, short_hash, 0]);

    if (insert_result.length === 0) {
        return res.status(500)
            .json({"error": "Could not insert url into database"});
    }

    return res.json(insert_result);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
