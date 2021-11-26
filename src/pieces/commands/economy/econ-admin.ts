import prisma from '@lib/prisma';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';

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
            const userDb = await prisma.user.findUnique({
                where: {
                    discord_id: user.id,
                },
                rejectOnNotFound: true,
            });

            storageType === 'wallet'
                ? (userDb.wallet += amount)
                : (userDb.bank += amount);
        } catch (err) {}

        const embed = new MessageEmbed().setTitle(
            `Added ${amount}$ to ${user.tag}'s ${storageType}'`
        );
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
