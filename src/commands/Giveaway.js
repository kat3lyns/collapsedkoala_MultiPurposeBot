const Discord = require('discord.js');
const settings = require('../../settings.json');
const { SlashCommandBuilder, SlashCommandStringOption, SlashCommandAttachmentOption, SlashCommandIntegerOption, EmbedBuilder } = require("@discordjs/builders");

const promisedMySQL = require('../api/promisedMySQL.js');
function durationSerializer(input) {
    const units = ["s", "m", "h", "d", "w", "mo", "y", "de"];
    const regex = RegExp(`(\\d+)(${units.join("|")})`, "g");
    const matches = Array.from(input.matchAll(regex));
    let output = 0;
    for (const match of matches) {
        const [, amount, unit] = match;
        const conversion = [1, 60, 3600, 86400, 604800, 2419200, 29030400, 290304000][units.indexOf(unit)];
        output += amount * conversion;
    }
    return output;
}
const titleRegex = /\w\S*/g;
function toTitleCase(string) {
    return string.replace(
        titleRegex,
        (text) => {
            return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        }
    )
}

module.exports = {
    commandData: new SlashCommandBuilder()
        .setName("creategiveaway")
        .setDescription("Create a new giveaway.")
        .addStringOption(new SlashCommandStringOption()
            .setName("title")
            .setDescription("The title of the giveaway.")
            .setRequired(true)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName("reward")
            .setDescription("The reward of the giveaway.")
            .setRequired(true)
        )
        .addIntegerOption(new SlashCommandIntegerOption()
            .setName("winners")
            .setDescription("The amount of winners.")
            .setRequired(true)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName("time")
            .setDescription("The length of the giveaway. (must exactly be like 0d 0h 0m 0s)")
            .setRequired(true)
        )
        .addAttachmentOption(new SlashCommandAttachmentOption()
            .setName("image")
            .setDescription("The image to use as the footer.")
            .setRequired(false)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName("footer")
            .setDescription("The text to use as the footer.")
            .setRequired(false)
        )
        .toJSON(),
    
    run: async(client, interaction) => {
        if(!interaction.member.roles.cache.has(settings.staff_role)) return interaction.reply({ content: "You can't do this.", ephemeral: true });

        const parsedTime = durationSerializer(interaction.options.getString("time"));
        const thenDate = new Date();
        
        thenDate.setTime(thenDate.getTime() + (parsedTime * 1000));

        const giveawayEmbed = new EmbedBuilder()
            .setAuthor({ name: interaction.options.getString("title"), iconURL: interaction.member.displayAvatarURL() })
            .setColor(0x832dc4)
            .setDescription(`Reward: ${toTitleCase(interaction.options.getString("reward"))}\nEnds In: <t:${Math.round(thenDate.getTime()/1000)}:R>\nWinners: ${interaction.options.getInteger("winners")}\n\nPlease react below to join the giveaway.`)
            .setTimestamp(new Date())
            .setFooter({ text: interaction.options.getString("footer") ? interaction.options.getString("footer") : "Giveaways System" })
            .setImage(interaction.options.getAttachment("image") ? interaction.options.getAttachment("image").proxyURL : null)
        ;

        const message = await interaction.channel.send({ embeds: [ giveawayEmbed.data ] });
        await message.react(`🥳`)

        await interaction.reply({ content: "Done!", ephemeral: true });

        await promisedMySQL(`INSERT INTO giveaways 
            (
                id,
                channel_id,
                message_id,
                reward,
                winners,
                end_stamp,
                title
            )
            VALUES
            (
                NULL,
                "${interaction.channel.id}",
                "${message.id}",
                "${toTitleCase(interaction.options.getString("reward"))}",
                ${interaction.options.getInteger("winners")},
                "${thenDate.getTime()}",
                "${interaction.options.getString("title")}"
            )
        `);
    }
}