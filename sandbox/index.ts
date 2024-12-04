import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet('car1', {
        color: 'red',
        year: 1950,
    });
    await client.hSet('car2', {
        color: 'green',
        year: 1960,
    });
    await client.hSet('car3', {
        color: 'blue',
        year: 1970,
    });

    const commands = [1,2,3].map((id) => {
        return client.hGetAll('car' + id);
    });

    const result = await Promise.all(commands);

    console.log(result);
};
run();
