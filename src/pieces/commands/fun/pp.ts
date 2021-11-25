import { send } from '@sapphire/plugin-editable-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { /* Args, */ Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: 'pp',
    description: 'Shows user penis size',
})
export class InfoCommand extends Command {
    public async messageRun(message: Message /*, args: Args */) {
        const embed = new MessageEmbed()
            .setTitle(`${message.author.username}'s cock size`)
            .setDescription(`${message.author}'s cock size is ${Math.floor(Math.random() * 12) + 1} inches`)
            .setColor('#5464af');

        // Using the send function from the editable-commands plugin, not the base one
        send(message, { embeds: [embed] });
    }
}
