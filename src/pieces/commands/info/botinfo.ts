import { send } from '@sapphire/plugin-editable-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { /* Args, */ Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: 'info',
    aliases: ['botinfo', 'inf', 'bot-info'],
})
export class InfoCommand extends Command {
    public async messageRun(message: Message /*, args: Args */) {
        message.react('🐱');

        const embed = new MessageEmbed()
            .setTitle('Information')
            .addField('balls', 'balls');

        // Using the send function from the editable-commands plugin, not the base one
        send(message, { content: 'hai', embeds: [embed] });
    }
}
