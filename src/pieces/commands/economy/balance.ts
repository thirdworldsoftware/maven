import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, Command, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { send } from '@sapphire/plugin-editable-commands';
import prisma from '@lib/prisma';

@ApplyOptions<CommandOptions>({
    name: 'balance',
    aliases: ['bal', 'bank', 'wallet'],
    description: 'Check your balance.',
})
export class InfoCommand extends Command {
    public async messageRun(message: Message, args: Args) {
        const user = await args.pick('user').catch(() => message.author);

        const userDb = await prisma.user.findUnique({
            where: {
                discord_id: user.id,
            },
        });

        const embed = new MessageEmbed()
            .setTitle(`${user.username}'s balance`)
            .addField('Bank', `${userDb?.bank}`, true)
            .addField('Wallet', `${userDb?.wallet}`, true);

        // Using the send function from the editable-commands plugin, not the base one
        send(message, { embeds: [embed] });
    }
}
