import { SapphireClient, Store } from '@sapphire/framework';
import { config } from '@config/index';
import { Ogma } from '@ogma/logger';
import '@sapphire/pieces';

export class Client extends SapphireClient {
    public consoleLogger: Ogma;

    public constructor() {
        super(config.client);

        this.consoleLogger = new Ogma({
            application: config.env.application,
            context: config.env.application,
            logLevel: config.env.logLevel,
        });

        this.consoleLogger.info('Instantiating client...', {
            context: 'ClientService',
        });

        this.setupStoreEventHandlers();
    }

    async init() {
        this.consoleLogger.verbose('Attempting to log in...', {
            context: 'ClientService',
        });

        const lr = await this.login();

        this.consoleLogger.info(
            `Logged in as ${this.user?.tag} (${this.user?.id})`,
            { context: 'ClientService' }
        );
        return lr;
    }

    private setupStoreEventHandlers() {
        Store.defaultStrategy.onLoad = (s, p) => {
            this.consoleLogger.info(`Loaded ${s.name}:${p.name}`, {
                context: 'LoaderService',
            });
        };

        Store.defaultStrategy.onUnload = (s, p) => {
            this.consoleLogger.info(`Unloaded ${s.name}:${p.name}`, {
                context: 'LoaderService',
            });
        };

        Store.defaultStrategy.onError = (e, p) => {
            this.consoleLogger.error(
                `${e.name} loading ${p}, info: ${e.message}`,
                {
                    context: 'LoaderService',
                }
            );
        };

        Store.defaultStrategy.onLoadAll = (s) => {
            this.consoleLogger.info(`Finished loading ${s.name}`, {
                context: 'LoaderService',
            });
        };
    }

    public async destroy() {
        return super.destroy();
    }
}
