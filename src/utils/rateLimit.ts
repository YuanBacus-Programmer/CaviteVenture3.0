import { NextApiRequest, NextApiResponse } from 'next';

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

const rateLimitMap = new Map<string, { count: number; expires: number }>();

export default function rateLimit(options: RateLimitOptions) {
  const { windowMs, max } = options;

  return async (req: NextApiRequest, res: NextApiResponse) => {
    const key = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const now = Date.now();

    const record = rateLimitMap.get(key as string);
    if (record) {
      // If the limit has expired, reset it
      if (record.expires < now) {
        rateLimitMap.set(key as string, { count: 1, expires: now + windowMs });
      } else {
        record.count += 1;
        if (record.count > max) {
          res.setHeader('Retry-After', Math.ceil((record.expires - now) / 1000));
          return res.status(429).json({ message: 'Too many requests, please try again later' });
        }
      }
    } else {
      rateLimitMap.set(key as string, { count: 1, expires: now + windowMs });
    }
  };
}
