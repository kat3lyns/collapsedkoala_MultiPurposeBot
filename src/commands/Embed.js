const Discord = require('discord.js');
const { SlashCommandBuilder, SlashCommandStringOption, SlashCommandAttachmentOption, EmbedBuilder } = require("@discordjs/builders");

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ]  : null;
  }

module.exports = {
    commandData: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Make a nice embedded message.")
        .addStringOption(new SlashCommandStringOption()
            .setName("colour")
            .setDescription("The colour of the embed.")
            .setRequired(true)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName("description")
            .setDescription("The description of the embed.")
            .setRequired(true)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName("title")
            .setDescription("The title of the embed.")
            .setRequired(true)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName("image")
            .setDescription("The image url of the embed.")
            .setRequired(false)
        )
        .addStringOption(new SlashCommandStringOption()
            .setName("footer")
            .setDescription("The footer of the embed.")
            .setRequired(false)
        ).toJSON(),
    
    run: async(client, interaction) => {
        if(!interaction.member.roles.cache.has(client.settings.staff_role)) return interaction.reply({ content: "You can't do this.", ephemeral: true });
        await interaction.reply({ content: "Done!", ephemeral: true });

        interaction.channel.send({ embeds: [
            new EmbedBuilder()
            .setAuthor({ name: interaction.options.getString("title"), iconURL: interaction.member.displayAvatarURL() })
            .setColor(hexToRgb(interaction.options.getString("colour")))
            .setDescription(interaction.options.getString("description").replaceAll("%nl%", "\n"))
            .setImage(interaction.options.getString("image"))
            .setFooter({ text: interaction.options.getString("footer") })
            .toJSON()
        ] })
    }
}