import { send } from '@sapphire/plugin-editable-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { /* Args, */ Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: 'roll',
    description: 'Rolls a dice',
})
export class InfoCommand extends Command {
    public async messageRun(message: Message /*, args: Args */) {
        const embed = new MessageEmbed()
            .setTitle(`${message.author.username} rolls a dice...`)
            .setDescription(`${message.author} rolls a ${Math.floor(Math.random() * 6) + 1}!`)
            .setColor('#5464af');

        // Using the send function from the editable-commands plugin, not the base one
        send(message, { embeds: [embed] });
    }
}
