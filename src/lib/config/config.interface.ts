import type { ClientOptions } from 'discord.js';
import '@sapphire/framework';
import type { LogLevel } from '@ogma/common';

export type IClientOptions = ClientOptions;

export interface IEnvironmentConfig {
    application: string;
    development: boolean;
    logLevel: keyof typeof LogLevel;
}

export interface IConfig {
    client: IClientOptions;
    env: IEnvironmentConfig;
}
