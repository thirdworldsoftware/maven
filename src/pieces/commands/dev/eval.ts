import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { Stopwatch } from '@sapphire/stopwatch';
import { Type } from '@sapphire/type';
import { isThenable } from '@sapphire/utilities';
import { inspect } from 'util';
import { setTimeout as sleep } from 'node:timers/promises';

@ApplyOptions<CommandOptions>({
    aliases: ['exec', 'ev'],
    description: 'Evaluates arbitrary code.',
    detailedDescription:
        'Evaluates arbitrary code. This command is only available to the bot owner.',
    flags: ['async', 'silent', 'json', 'hidden', 'no-timeout'],
    options: ['wait', 'depth'],
})
export class EvalCommand extends Command {
    public async messageRun(message: Message, args: Args) {
        const code = await args.rest('string');

        const wait = args.getOption('wait');
        const flagTime = args.getFlags('no-timeout')
            ? wait === null
                ? 60000
                : Number(wait)
            : Infinity;

        const { success, type, time, result } = await this.timedEval(
            message,
            args,
            code,
            flagTime
        );

        if (args.getFlags('silent')) {
            if (!success && result)
                this.container.__client.consoleLogger.error(result);
            return;
        }

        if (success) {
            this.container.__client.consoleLogger.info(result, {
                context: 'EvalCommand',
            });
        } else {
        }
    }

    private async timedEval(
        message: Message,
        args: Args,
        code: string,
        flagTime: number
    ) {
        if (flagTime === Infinity || flagTime === 0)
            return this.eval(message, args, code);
        return Promise.race([
            sleep(flagTime).then(() => ({
                result: `Eval timed out ${flagTime}ms`,
                success: false,
                time: '⏱ ...',
                type: 'EvalTimeoutError',
            })),
            this.eval(message, args, code),
        ]);
    }

    private async eval(message: Message, args: Args, code: string) {
        const stopwatch = new Stopwatch();
        let success: boolean;
        let syncTime = '';
        let asyncTime = '';
        let result: unknown;
        let thenable = false;
        let type: Type;

        try {
            if (args.getFlags('async')) code = `(async () => {\n${code}\n})();`;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const msg = message;

            result = eval(code);
            syncTime = stopwatch.toString();
            type = new Type(result);

            if (isThenable(result)) {
                thenable = true;
                stopwatch.restart();
                result = await result;
                asyncTime = stopwatch.toString();
            }

            success = true;
        } catch (err) {
            if (!syncTime.length) syncTime = stopwatch.toString();
            if (thenable && !asyncTime.length) asyncTime = stopwatch.toString();
            if (!type!) type = new Type(err);
            result = err;
            success = false;
        }

        stopwatch.stop();

        if (typeof result !== 'string') {
            result =
                result instanceof Error
                    ? result.stack
                    : args.getFlags('json')
                    ? JSON.stringify(result)
                    : inspect(result, {
                          depth: Number(args.getOption('depth') ?? 0) || 0,
                          showHidden: args.getFlags('showHidden', 'hidden'),
                      });
        }

        return {
            success,
            type: type!,
            time: this.formatTime(syncTime, asyncTime ?? ''),
            result,
        };
    }

    private formatTime(syncTime: string, asyncTime?: string) {
        return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
    }
}
