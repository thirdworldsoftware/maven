import { Client } from '@lib/client';
import { preInit } from '@lib/setup';

async function main() {
    preInit();

    const client = new Client();

    await client.init();
}

main();
