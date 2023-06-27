import { Request, Response, NextFunction } from 'express';

export const rate_limiter = (req: Request, res: Response, next: NextFunction) => {
    var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress);

    if (ip === undefined) {
        // TODO: Error
    }

    // ip = ip.replace('::ffff:', '');
    console.log(ip);

    // TODO: rate limit

    next();
}

