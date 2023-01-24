const Discord = require('discord.js');
const suggestMenu = require('../../suggest_menu.json');
const { SlashCommandBuilder, SlashCommandStringOption, SlashCommandAttachmentOption, SlashCommandIntegerOption, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");

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
        .setName("suggestmenu")
        .setDescription("Send the suggestion creation embed.")
        .toJSON(),
    
    run: async(client, interaction) => {
        if(!interaction.member.roles.cache.has(client.settings.staff_role)) return interaction.reply({ content: "You can't do this.", ephemeral: true });

        await interaction.reply({ content: "Done", ephemeral: true });
        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton().setCustomId(suggestMenu.button.id).setEmoji(suggestMenu.button.emoji).setLabel(suggestMenu.button.name).setStyle("PRIMARY").toJSON()
        );

        const embed = new Discord.MessageEmbed()
        .setColor(hexToRgb(suggestMenu.embed_colour))
        .setDescription(suggestMenu.embed_description)
        .setFooter({ text: suggestMenu.embed_footer })
        .setImage(suggestMenu.embed_image)
        .setTitle(suggestMenu.embed_title);

        await interaction.channel.send({ embeds: [ embed ], components: [ row.toJSON() ] });
    }
}