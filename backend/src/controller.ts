import { Request, Response } from 'express';
import sha256 from 'crypto-js/sha256';

import { pg_pool, query } from "./db";

const PAGE_404_URL = process.env.PAGE_404_URL || 'http://localhost:3000/404';

export const getURLs = async (req: Request, res: Response) => {
    const urls = await query('SELECT * FROM shortest', [])
        .catch((err) => res.status(500).json(err));
    res.status(200).json(urls);
}

export const redirectURL = async (req: Request, res: Response) => {
    const { current_hash } = req.params;

    try {
        const url_response = await query(
            'SELECT * FROM shortest WHERE short_hash = $1', [current_hash]);

        if (url_response.length === 0) {
            return res.redirect(302, PAGE_404_URL);
        }

        const id = url_response[0].id;
        const long_url = url_response[0].long_url;
        await query(
            'UPDATE shortest SET visit_count = visit_count + 1 WHERE id = $1',
            [id]
        );

        return res.redirect(302, long_url);
    } catch (err) {
        return res.status(500).json(err);
    }
}

export const postURL = async (req: Request, res: Response) => {
    try {
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
    } catch (err) {
        return res.status(500).json("DB error: " + err);
    }
}

