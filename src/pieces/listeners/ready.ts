import { ApplyOptions } from '@sapphire/decorators';
import {
    Events,
    Listener,
    container,
    ListenerOptions,
} from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
    once: true,
    name: 'ClientReady',
})
export class ReadyListener extends Listener<typeof Events.ClientReady> {
    run() {
        const { __client } = container;

        __client.consoleLogger.info('Event fired: Client ready', {
            context: 'EventListener',
        });
    }
}
