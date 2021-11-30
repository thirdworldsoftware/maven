import prisma from '@lib/prisma';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';
import { send } from '@sapphire/plugin-editable-commands';
import { ErrorEmbed, PrebuiltErrors } from '@lib/util/embed';

@ApplyOptions<SubCommandPluginCommand.Options>({
    name: 'bank',
    aliases: ['vault', 'bk', 'vl'],
    description: 'Withdraw or deposit balance from the bank.',
    subCommands: [
        { input: 'help', default: true },

        'deposit',
        'withdraw',

        { input: 'wd', output: 'withdraw' },
        { input: 'w', output: 'withdraw' },
        { input: 'dp', output: 'deposit' },
        { input: 'd', output: 'deposit' },
    ],
})
export class InfoCommand extends SubCommandPluginCommand {
    public async help(message: Message) {
        const embed = new MessageEmbed()
            .setTitle('Bank - available commands')
            .addField(
                '`deposit`',
                'Deposit money into the bank. Aliases: `d`, `dp`'
            )
            .addField(
                '`withdraw`',
                'Withdraw money from the bank. Aliases: `w`, `wd`'
            );

        send(message, { embeds: [embed] });
    }

    public async deposit(message: Message, args: Args) {
        const amount = await args.pick('number');

        if (await this.verifyAmount(message, amount, 'w')) {
            await prisma.user.update({
                where: {
                    discord_id: message.author.id,
                },
                data: {
                    bank: {
                        increment: amount,
                    },
                    wallet: {
                        decrement: amount,
                    },
                },
            });

            return send(message, {
                embeds: [new MessageEmbed().setTitle('Transaction successful')],
            });
        }

        return;
    }

    public async withdraw(message: Message, args: Args) {
        const amount = await args.pick('number');

        if (await this.verifyAmount(message, amount, 'b')) {
            await prisma.user.update({
                where: {
                    discord_id: message.author.id,
                },
                data: {
                    wallet: {
                        increment: amount,
                    },
                    bank: {
                        decrement: amount,
                    },
                },
            });

            return send(message, {
                embeds: [new MessageEmbed().setTitle('Transaction successful')],
            });
        }

        return;
    }

    private async verifyAmount(
        msg: Message,
        amount: number,
        storageType: 'b' | 'w'
    ) {
        if (amount <= 0) {
            return send(msg, {
                embeds: ErrorEmbed({
                    title: PrebuiltErrors.arguments,
                    message: 'Amount must be higher than 0',
                }),
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                discord_id: msg.author.id,
            },
            select: {
                bank: true,
                wallet: true,
            },
        });

        if (user !== null) {
            if (amount >= user.wallet || amount >= user.bank) {
                return send(msg, {
                    embeds: ErrorEmbed({
                        title: PrebuiltErrors.arguments,
                        message: `You don't have enough money in your ${storageType} to do that.`,
                    }),
                });
            }
        } else
            return send(msg, {
                embeds: ErrorEmbed({
                    title: PrebuiltErrors.transaction,
                    message: 'User not found, register with ;register',
                }),
            });

        return true;
    }
}
