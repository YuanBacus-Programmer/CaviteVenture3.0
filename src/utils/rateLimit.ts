import { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
  windowMs: number; // Time window in milliseconds
  max: number; // Max number of requests allowed per window
  uniqueTokenPerInterval?: number; // Optional: max unique tokens per interval (default is 500)
};

// Create an LRU cache to store rate limit records
export default function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, uniqueTokenPerInterval = 500 } = options;

  const tokenCache = new LRUCache<string, number>({
    max: uniqueTokenPerInterval,
    ttl: windowMs,
  });

  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const tokenString = Array.isArray(token) ? token[0] : token;

    const tokenCount = tokenCache.get(tokenString) || 0;

    if (tokenCount >= max) {
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', 0);
      return res.status(429).json({ message: 'Rate limit exceeded' });
    }

    tokenCache.set(tokenString, tokenCount + 1);
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', max - (tokenCount + 1));
  };
}
