import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

const noopRedis = {
    get: async () => null,
    set: async () => null,
    del: async () => null,
};

let redis;

if (!redisUrl) {
    console.warn('REDIS_URL not set; using noop Redis client');
    redis = noopRedis;
} else {
    const client = new Redis(redisUrl);
    client.on('connect', () => console.log('Redis connecting'));
    client.on('ready', () => console.log('Redis connected'));
    client.on('error', (err) => console.error('Redis error:', err.message || err));
    redis = client;
}

export { redis };