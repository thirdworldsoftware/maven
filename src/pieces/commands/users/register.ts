import { send } from '@sapphire/plugin-editable-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { /* Args, */ Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { Prisma } from '@prisma/client';
import prisma from '@lib/prisma';

@ApplyOptions<CommandOptions>({
    name: 'register',
    aliases: ['reg'],
    description:
        'Registers you into the bot database. Possibly deprecated in the future.',
})
export class InfoCommand extends Command {
    public async messageRun(message: Message /*, args: Args */) {
        let embed = new MessageEmbed()
            .setTitle('❌ Registration failed!')
            .setDescription(
                'Unknown error during registration, please contact the developers if the issue persists.'
            );

        try {
            await prisma.user.create({
                data: {
                    discord_id: message.author.id,
                    display_name: message.author.username,
                },
            });

            embed = new MessageEmbed().setTitle('✅ Registration successful!');
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    embed.setDescription(
                        'You are likely already registered. If not, please contact support.'
                    );
                } else {
                    embed.setDescription(
                        `Error during registration: ${err.name} (${err.code}).`
                    );
                }
            }
        }
        return send(message, { embeds: [embed] });
    }
}
