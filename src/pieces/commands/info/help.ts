import { send } from '@sapphire/plugin-editable-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { /* Args, */ Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: 'help',
    aliases: ['h'],
    description: 'Shows various pieces of information related to the client'
})
export class InfoCommand extends Command {
    public async messageRun(message: Message /*, args: Args */) {

        const embed = new MessageEmbed()
            .setTitle('Commands')
            .setDescription(`
            **__# Fun__**
            - coinflip / iq 

            **__# Information__**
            - botinfo / help / serverinfo
            `)
            .setColor('#5464af')

        // Using the send function from the editable-commands plugin, not the base one
        send(message, { embeds: [embed] });
    }
}
