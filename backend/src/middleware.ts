import { Request, Response, NextFunction } from 'express';

import { redis_client } from './db';

const FIXED_TIME_IN_SECONDS: number = 43200;
const MAX_ATTEMPTS_IN_WINDOW: number = 100;

// TODO: Generate this in a better way
const ONE_MINUTE_IN_SECONDS = 60;
const ONE_HOUR_IN_SECONDS = 3600;
const shorten_time = (ttl_seconds: number) => {
    var short_ttl = '';

    if (ttl_seconds < ONE_MINUTE_IN_SECONDS) {
        let seconds_unit = (ttl_seconds === 1) ? 'second' : 'seconds';
        short_ttl = `${ttl_seconds} ${seconds_unit}`;
    } else if (ttl_seconds < ONE_HOUR_IN_SECONDS) {
        let minutes = Math.floor(ttl_seconds / ONE_MINUTE_IN_SECONDS);
        let minutes_unit = (minutes === 1) ? 'minute' : 'minutes';
        let seconds = ttl_seconds - (ONE_MINUTE_IN_SECONDS * minutes);
        let seconds_unit = (seconds === 1) ? 'second' : 'seconds';
        short_ttl = `${minutes} ${minutes_unit} and ${seconds} ${seconds_unit}`;
    } else {
        let hours = Math.floor(ttl_seconds / ONE_HOUR_IN_SECONDS);
        let hours_unit = (hours === 1) ? 'hour' : 'hours';
        let remaining_seconds = ttl_seconds - (ONE_HOUR_IN_SECONDS * hours);
        let minutes = Math.floor(remaining_seconds / ONE_MINUTE_IN_SECONDS);
        let minutes_unit = (minutes === 1) ? 'minute' : 'minutes';
        short_ttl = `${hours} ${hours_unit} and ${minutes} ${minutes_unit}`;
    }

    return short_ttl;
}

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
            const ttl = await redis_client.ttl(ip);
            const short_time = shorten_time(ttl);
            return res.status(429).json(
                'Too many requests, retry in ' + short_time
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

