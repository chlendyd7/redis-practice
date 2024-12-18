import { randomBytes } from 'crypto'
import { client } from './client';

export const withLock = async (key: string, cb: (signal: any) => any) => {
	const retryDelayMs = 100; //재시도 ms
	let retries = 20; // 재시도 횟수

	// Generate a random value to store at the lock key (무작위 값을 만들어야함)
	const token = randomBytes(6).toString('hex');

	// Create the lock key
	const lockKey = `lock:${key}`;
	
	// Set up a while loop to implement the retry behavior
	while (retries >= 0) {
		retries--;

		// Try to do a SET NX operation
		const acquired = await client.set(lockKey, token, {
			NX: true,
			PX: 2000
		});
		if (!acquired) {
			await pause(retryDelayMs);
			continue
		}

		try {
			const signal = { expired: false };
			setTimeout(() => {
				signal.expired = true;
			}, 2000);

			const result = await cb(signal);
			return result;
		} finally {
			await client.unlock(lockKey, token);
		}
	}
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
