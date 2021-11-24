import { send } from '@sapphire/plugin-editable-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { /* Args, */ Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: 'coinflip',
    aliases: ['cf', 'flip'],
    description: 'Flips a coin'
})

export class InfoCommand extends Command {
    public async messageRun(message: Message /*, args: Args */) {

        let options = [
            "Heads", 
            "Tails",
        ]
        let winner = options[Math.floor(Math.random() * options.length)];

        const embed = new MessageEmbed()
            .setTitle(`${message.author.username} is flipping a coin...`)
            .setDescription(`The coin landed on **${winner}!** `) 
            .setColor('#5464af')

        // Using the send function from the editable-commands plugin, not the base one
        send(message, { embeds: [embed] });
    }
}
