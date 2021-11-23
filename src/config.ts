import type { IConfig } from '@config/index';
import { join } from 'path';

export const isDevenv =
    process.env.NODE_ENV !== 'production' || Boolean(process.env.DEVENV);

export const config: IConfig = {
    client: {
        intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_MESSAGES'],

        baseUserDirectory: `${join(__dirname, 'pieces')}`,
        caseInsensitiveCommands: true,
        caseInsensitivePrefixes: true,

        defaultPrefix: ';',
    },

    env: {
        application: 'BOT',
        development: isDevenv,
        logLevel: isDevenv ? 'DEBUG' : 'INFO',
    },
};
