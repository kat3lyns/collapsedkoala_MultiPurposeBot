const Discord = require('discord.js');
const { SlashCommandBuilder, SlashCommandStringOption, SlashCommandAttachmentOption, EmbedBuilder } = require("@discordjs/builders");
const settings = require('../../settings.json');

function getSuggestions() {
    return require('../../suggestions.json');
}

module.exports = {
    commandData: new SlashCommandBuilder()
        .setName("denysuggestion")
        .setDescription("Deny a suggestion.")
        .addStringOption(new SlashCommandStringOption()
            .setName("id")
            .setDescription("The ID of the suggestion.")
            .setRequired(true)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName("reason")
            .setDescription("The reasoning for why this is being rejected.")
            .setRequired(true)
        ).toJSON(),
    
    run: async(client, interaction) => {
        if(!interaction.member.roles.cache.has(client.settings.staff_role)) return interaction.reply({ content: "You can't do this.", ephemeral: true });

        const suggestions = getSuggestions();
        const id = interaction.options.getString("id");

        if(!Object.keys(suggestions).includes(id)) return await interaction.reply({ content: "This suggestion doesn't exist!", ephemeral: true });
        await interaction.reply({ content: "Done!", ephemeral: true });
        
        const originalChannel = interaction.guild.channels.cache.get(suggestions[id]["channel_id"]);
        const originalMessage = await originalChannel.messages.fetch(suggestions[id]["message_id"]);
        const member = await interaction.guild.members.fetch(suggestions[id]["suggester"]);

        const embed = originalMessage.embeds[0];
        embed.setDescription(embed.description.replace("Click one of the buttons below to react!", "This suggestion is closed!"));

        await originalMessage.edit({ embeds: [ embed ] });

        const channel = interaction.guild.channels.cache.get(settings.accepted_suggestions);
        await channel.send({ embeds: [
            new EmbedBuilder()
            .setAuthor({ name: `Denied Suggestion from ${member.user.tag}`, iconURL: member.displayAvatarURL() })
                .setColor(0xff5e5e)
                .setDescription(suggestions[id]["suggestion"])
                .addFields([
                    {
                        name: "Suggestion ID#",
                        value: id,
                    },
                    {
                        name: "Reasoning",
                        value: interaction.options.getString("reason"),
                    }
                ])
                .setTimestamp(new Date())
                .setFooter({ text: "Suggestions System" }).data
        ] });
    }
}