import { Request, Response } from 'express';
import sha256 from 'crypto-js/sha256';

import { query } from "./db";

// TODO: Remove
export const rlTest = (req: Request, res: Response) => {
    res.send("Test rate limiter");
}

export const getURLs = async (req: Request, res: Response) => {
    const urls = await query('SELECT * FROM shortest', []);
    res.status(200).json(urls);
}

export const postURL = async (req: Request, res: Response) => {
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

    return res.json(insert_result[0]);
}

