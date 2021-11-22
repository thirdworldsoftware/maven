import { Events, Listener, container } from '@sapphire/framework';

export class ReadyListener extends Listener<typeof Events.ClientReady> {
    run() {
        const { __client } = container;

        __client.consoleLogger.info('Event fired: Client ready', {
            context: 'EventListener',
        });
    }
}
