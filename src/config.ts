import type { IConfig } from '@config/index';

export const isDevenv = process.env.NODE_ENV !== 'production';

export const config: IConfig = {
	client: {
		intents: ['DIRECT_MESSAGES', 'GUILDS', 'GUILD_MESSAGES'],

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
