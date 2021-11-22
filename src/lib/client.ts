import { SapphireClient } from '@sapphire/framework';
import { config } from '@config/index';
import { Ogma } from '@ogma/logger';

export class Client extends SapphireClient {
    public consoleLogger: Ogma;

    public constructor() {
        super(config.client);

        this.consoleLogger = new Ogma({
            application: config.env.application,
            context: config.env.application,
            logLevel: config.env.logLevel,
        });

        this.consoleLogger.info('Building client...', {
            context: 'ClientService',
        });
    }

    async init() {
        this.consoleLogger.verbose('Attempting log in...', {
            context: 'ClientService',
        });

        const lr = await this.login();

        this.consoleLogger.info(
            `Logged in as ${this.user?.tag} (${this.user?.id})`,
            { context: 'ClientService' }
        );
        return lr;
    }

    public async destroy() {
        return super.destroy();
    }
}
