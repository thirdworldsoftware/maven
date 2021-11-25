import { SapphireClient, Store, container } from '@sapphire/framework';
import { config } from '@config/index';
import { Ogma } from '@ogma/logger';
import '@sapphire/pieces';
import prisma from './prisma';

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
        this.setupPrismaEventHandlers();

        container.__client = this;
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
        const context = 'LoaderService';

        Store.defaultStrategy.onLoad = (s, p) => {
            this.consoleLogger.info(`Loaded ${s.name}:${p.name}`, {
                context,
            });
        };

        Store.defaultStrategy.onUnload = (s, p) => {
            this.consoleLogger.info(`Unloaded ${s.name}:${p.name}`, {
                context,
            });
        };

        Store.defaultStrategy.onError = (e, p) => {
            this.consoleLogger.error(
                `${e.name} loading ${p}, info: ${e.message}`,
                {
                    context,
                }
            );
        };

        Store.defaultStrategy.onLoadAll = (s) => {
            this.consoleLogger.info(`Finished loading ${s.name}`, {
                context,
            });
        };
    }

    private async setupPrismaEventHandlers() {
        await prisma.$connect();

        const context = 'PrismaService';

        prisma.$on('query', (ev) => {
            this.consoleLogger.verbose(
                `Received query - took ${ev.duration}ms, executed: ${ev.query}`,
                {
                    context,
                }
            );
        });

        const levels: ('info' | 'warn' | 'error')[] = ['info', 'warn', 'error'];

        for (let level of levels) {
            prisma.$on(level, (ev) => {
                this.consoleLogger.info(`${ev.message}`, {
                    context,
                });
            });
        }
    }

    public async destroy() {
        return super.destroy();
    }
}

declare module '@sapphire/pieces' {
    interface Container {
        __client: Client;
    }
}
