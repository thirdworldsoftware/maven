import { send } from '@sapphire/plugin-editable-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { /* Args, */ Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: 'ping',
    description: 'Shows client ping'
})
export class InfoCommand extends Command {
    public async messageRun(message: Message /*, args: Args */) {

        const embed = new MessageEmbed()
            .setTitle('Client Ping')
            .setColor('#5464af')
            .setDescription(`**Ping**: ${Math.round(this.container.client.ws.ping)}ms`)

        // Using the send function from the editable-commands plugin, not the base one
        send(message, { embeds: [embed] });
    }
}

