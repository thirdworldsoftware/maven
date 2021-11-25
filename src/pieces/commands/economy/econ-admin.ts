import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';

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
        message.reply('wip');
    }
}
