import { send } from '@sapphire/plugin-editable-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { /* Args, */ Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: 'info',
    aliases: ['botinfo', 'inf', 'bot-info'],
    description: 'Shows various pieces of information related to the client',
})
export class InfoCommand extends Command {
    public async messageRun(message: Message /*, args: Args */) {
        const embed = new MessageEmbed()
            .setTitle('Information')
            .setColor('#5464af')
            .addField(
                'Client Ping:',
                `${Math.round(this.container.client.ws.ping)}ms`
            )
            .setFooter(
                `${this.container.client.id} | Developed by synesta#5526 and Legacy#0425`
            );

        // Using the send function from the editable-commands plugin, not the base one
        send(message, { embeds: [embed] });
    }
}
