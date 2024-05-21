/* istanbul ignore file */
import IoRedis from 'ioredis';
import Redlock, { ResourceLockedError } from 'redlock';

const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';

const redis = new IoRedis(redisPort, redisHost);

redis.on('error', (error) => {
	console.error('ERROR initializing Redis connection', error.message);
});

redis.on('connect', () => {
	console.log(`The connection to Redis was correctly established on port: ${redis.options.port}`);
});

export const redlock = new Redlock([redis], {
	driftFactor: 0.01,
	retryCount: 10,
	retryDelay: 200,
	retryJitter: 200,
});

redlock.on('clientError', (err) => {
	if (err instanceof ResourceLockedError) {
		return;
	}
	console.error(`A redis error has occurred: ${err}`);
});

export default redis;
