const Discord = require('discord.js');
const ticketMenu = require('../../ticket_menu.json');

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ]  : null;
}

module.exports = {
    eventName: "interactionCreate",
    run: async(bot, interaction) => {
        if(interaction.isButton() && interaction.customId == "closeTicket") {
            const embed = new Discord.MessageEmbed();
            embed.setDescription(`This ticket was closed! There is 3 buttons below for you to press.`);
            embed.setColor(hexToRgb(ticketMenu.embed_colour));
            embed.setFooter({ text: ticketMenu.embed_footer });
            embed.setImage(ticketMenu.embed_image);

            const splitTopic = interaction.channel.topic.split("-");

            const closeTicketMenu = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                .setEmoji("🔒")
                .setStyle("DANGER")
                .setCustomId("deleteTicket")
                .setLabel("Delete Ticket"),
                new Discord.MessageButton()
                .setEmoji("🔓")
                .setStyle("SUCCESS")
                .setCustomId("reopenTicket")
                .setLabel("Reopen Ticket"),
                new Discord.MessageButton()
                .setEmoji("📰")
                .setStyle("SECONDARY")
                .setCustomId("transcriptTicket")
                .setLabel("Make Transcript")
            );

            const options = ticketMenu.options.filter(option => option.id == splitTopic[1] )[0];

            await interaction.channel.edit({ permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [ Discord.Permissions.FLAGS.VIEW_CHANNEL ]
                },
                {
                    id: options.support_role,
                    allow: [ Discord.Permissions.FLAGS.VIEW_CHANNEL,
                        Discord.Permissions.FLAGS.SEND_MESSAGES, 
                        Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY, 
                        Discord.Permissions.FLAGS.ATTACH_FILES,
                        Discord.Permissions.FLAGS.EMBED_LINKS
                    ]
                }
            ] });

            await interaction.channel.send({ embeds: [ embed ], components: [ closeTicketMenu ] });
            await interaction.reply({ content: "Done!", ephemeral: true });
        }
    }
}