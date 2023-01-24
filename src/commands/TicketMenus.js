const Discord = require('discord.js');
const ticketMenu = require('../../ticket_menu.json');
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
        .setName("sendticket")
        .setDescription("Send the ticket message embed.")
        .toJSON(),
    
    run: async(client, interaction) => {
        if(!interaction.member.roles.cache.has(client.settings.staff_role)) return interaction.reply({ content: "You can't do this.", ephemeral: true });

        interaction.reply({ content: "Done", ephemeral: true });
        const row = new Discord.MessageActionRow().addComponents(ticketMenu.options.map((data) => 
            new Discord.MessageButton().setCustomId(data.id).setEmoji(data.emoji).setLabel(data.name).setStyle("PRIMARY").toJSON()
        ));
        const embed = new Discord.MessageEmbed()
        .setColor(hexToRgb(ticketMenu.embed_colour))
        .setDescription(ticketMenu.embed_description)
        .setFooter({ text: ticketMenu.embed_footer })
        .setImage(ticketMenu.embed_image)
        .setTitle(ticketMenu.embed_title);

        await interaction.channel.send({ embeds: [ embed ], components: [ row.toJSON() ] })
    }
}