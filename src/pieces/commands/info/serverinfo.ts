import { send } from '@sapphire/plugin-editable-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { /* Args, */ Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: 'serverinfo',
    description: 'Shows various pieces of information related to the server',
    runIn: ['GUILD_ANY'],
})
export class InfoCommand extends Command {
    public async messageRun(message: Message /*, args: Args */) {
        const embed = new MessageEmbed()
            .setTitle('Server Information')
            .addField('Server Name:', `${message.guild?.name}`)
            .addField('Total Members:', `${message.guild?.memberCount}`)
            .addField('Channels:', `${message.guild?.channels.cache.size}`)
            .addField(
                'Created At:',
                `${message.guild?.createdAt.toDateString()} ${message.guild?.createdAt.toTimeString()}`
            )
            .addField(
                'Owner:',
                `${(await message.guild?.fetchOwner())?.user.tag}`
            )
            .setColor('#5464af');

        // Using the send function from the editable-commands plugin, not the base one
        send(message, { embeds: [embed] });
    }
}
