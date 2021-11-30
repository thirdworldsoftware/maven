import { MessageEmbed } from 'discord.js';

export const PrebuiltErrors = {
    transaction: 'Error validating transaction',
    arguments: 'Error validating arguments',
};

export interface ErrorEmbedOptions {
    title: string;
    message: string;
}

export const ErrorEmbed = (opts: ErrorEmbedOptions) => {
    const emb = new MessageEmbed()
        .setTitle(`🚫 ${opts.title}`)
        .setDescription(opts.message);

    return [emb];
};
