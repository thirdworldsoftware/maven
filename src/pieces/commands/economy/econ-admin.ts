import prisma from '@lib/prisma';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';
import { send } from '@sapphire/plugin-editable-commands';

type kWallet = 'wallet' | 'w';
type kBank = 'bank' | 'b';

const nWallet: readonly kWallet[] = ['wallet', 'w'];
const nBank: readonly kBank[] = ['bank', 'b'];

@ApplyOptions<SubCommandPluginCommand.Options>({
    aliases: ['ecd', 'ed'],
    generateDashLessAliases: true,
    subCommands: [
        { input: 'help', default: true },
        'add',
        'remove',
        'list',
        'reset',
        'set',

        { input: 'rm', output: 'remove' },
        { input: 'ls', output: 'list' },
        { input: 'rs', output: 'reset' },
    ],
})
export class EconAdminCommand extends SubCommandPluginCommand {
    public async add(message: Message, args: Args) {
        const user = await args.pick('user').catch(() => message.author);
        const storageType = await args
            .pick(EconAdminCommand.walletOrBank)
            .catch(() => 'wallet');
        const amount = await args.pick('number');

        try {
            const data =
                storageType === 'wallet'
                    ? { wallet: { increment: amount } }
                    : { bank: { increment: amount } };

            await prisma.user.update({
                where: {
                    discord_id: user.id,
                },
                data,
            });
        } catch (err) {
            if (err instanceof Error) {
                const embed = new MessageEmbed()
                    .setTitle('Unknown error during operation')
                    .setDescription(err.message)
                    .setColor('RED');

                return send(message, { embeds: [embed] });
            }
        }

        const embed = new MessageEmbed()
            .setTitle(`Added ${amount} to ${user.tag}'s ${storageType}'`)
            .setColor('GREEN');

        return send(message, { embeds: [embed] });
    }

    public async remove(message: Message, args: Args) {
        const user = await args.pick('user').catch(() => message.author);
        const storageType = await args
            .pick(EconAdminCommand.walletOrBank)
            .catch(() => 'wallet');
        const amount = await args.pick('number');

        try {
            const data =
                storageType === 'wallet'
                    ? { wallet: { decrement: amount } }
                    : { bank: { decrement: amount } };

            await prisma.user.update({
                where: {
                    discord_id: user.id,
                },
                data,
            });
        } catch (err) {
            if (err instanceof Error) {
                const embed = new MessageEmbed()
                    .setTitle('Unknown error during operation')
                    .setDescription(err.message)
                    .setColor('RED');

                return send(message, { embeds: [embed] });
            }
        }

        const embed = new MessageEmbed()
            .setTitle(`Removed ${amount} from ${user.tag}'s ${storageType}'`)
            .setColor('GREEN');

        return send(message, { embeds: [embed] });
    }

    public async reset(message: Message, args: Args) {
        const user = await args.pick('user').catch(() => message.author);

        try {
            await prisma.user.update({
                where: {
                    discord_id: user.id,
                },
                data: {
                    bank: 0,
                    wallet: 0,
                },
            });
        } catch (err) {
            if (err instanceof Error) {
                const embed = new MessageEmbed()
                    .setTitle('Unknown error during operation')
                    .setDescription(err.message)
                    .setColor('RED');

                return send(message, { embeds: [embed] });
            }
        }

        const embed = new MessageEmbed()
            .setTitle(`Reset ${user.tag}`)
            .setColor('GREEN');

        return send(message, { embeds: [embed] });
    }

    public async set(message: Message, args: Args) {
        const user = await args.pick('user').catch(() => message.author);
        const storageType = await args
            .pick(EconAdminCommand.walletOrBank)
            .catch(() => 'wallet');
        const amount = await args.pick('number');

        try {
            const data =
                storageType === 'wallet'
                    ? { wallet: amount }
                    : { bank: amount };

            await prisma.user.update({
                where: {
                    discord_id: user.id,
                },
                data,
            });
        } catch (err) {
            if (err instanceof Error) {
                const embed = new MessageEmbed()
                    .setTitle('Unknown error during operation')
                    .setDescription(err.message)
                    .setColor('RED');

                return send(message, { embeds: [embed] });
            }
        }

        const embed = new MessageEmbed()
            .setTitle(`Added ${amount} to ${user.tag}'s ${storageType}'`)
            .setColor('GREEN');

        return send(message, { embeds: [embed] });
    }

    private static walletOrBank = Args.make<'bank' | 'wallet'>(
        (parameter, { argument }) => {
            if (nWallet.includes(parameter.toLowerCase() as kWallet)) {
                return Args.ok('bank');
            } else if (nBank.includes(parameter.toLowerCase() as kBank)) {
                return Args.ok('wallet');
            }

            return Args.error({
                argument,
                parameter,
                identifier:
                    'Invalid storage type argument (needs to be bank or wallet).',
            });
        }
    );
}
