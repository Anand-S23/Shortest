import { Request, Response, NextFunction } from 'express';

import { redis_client } from './db';

const FIXED_TIME_IN_SECONDS: number = 3600;
const MAX_ATTEMPTS_IN_WINDOW: number = 3;

export const rate_limiter = async (
    req: Request, res: Response, next: NextFunction
) => {
    var ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress);
    ip = ip?.toString().replace('::ffff:', '');

    if (ip === undefined) {
        return res.status(401).json("IP not valid");
    }

    try {
        const attempts: number = parseInt(await redis_client.get(ip) ?? '0', 10);

        if (attempts >= MAX_ATTEMPTS_IN_WINDOW) {
            // TODO: might want to return retry in
            return res.status(429).json(
                'Too many requests, only 3 per hour are allowed'
            );
        } else if (attempts > 0) {
            await redis_client.incr(ip);
        } else {
            await redis_client.set(ip, 1, { EX: FIXED_TIME_IN_SECONDS });
        }

    } catch (err) {
        return res.status(500).json('DB error: ' + err);
    }

    next();
}

