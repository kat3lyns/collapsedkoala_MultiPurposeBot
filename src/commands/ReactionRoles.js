const Discord = require('discord.js');
const reactionConfig = require('../../reaction_roles.json');
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
        .setName("sendreactionrole")
        .setDescription("Send the reaction role embed.")
        .toJSON(),
    
    run: async(client, interaction) => {
        if(!interaction.member.roles.cache.has(client.settings.staff_role)) return interaction.reply({ content: "You can't do this.", ephemeral: true });

        interaction.reply({ content: "Done", ephemeral: true });
        const embed = new Discord.MessageEmbed()
        .setColor(hexToRgb(reactionConfig.embed_colour))
        .setDescription(reactionConfig.embed_description)
        .setFooter({ text: reactionConfig.embed_footer, iconURL: reactionConfig.embed_footericon })
        .setImage(reactionConfig.embed_image)
        .setTitle(reactionConfig.embed_title);

        const message = await interaction.channel.send({ embeds: [ embed ] });
        reactionConfig.options.map(async(options) => await message.react(options.emoji));
    }
}