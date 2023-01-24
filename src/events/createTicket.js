const ticketMenu = require("../../ticket_menu.json");
const config = require("../../settings.json");
const Discord = require('discord.js');

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
        if(interaction.isButton() && interaction.customId.includes("ticket_option_")) {
            ticketMenu.options.forEach(async(option) => {
                if(option.id == interaction.customId) {
                    const category = interaction.guild.channels.cache.get(option.category);

                    const channel = await interaction.guild.channels.create(`ticket-${interaction.user.username}-${option.name}`, {
                        type: "GUILD_TEXT",
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [ Discord.Permissions.FLAGS.VIEW_CHANNEL ]
                            },
                            {
                                id: interaction.member.id,
                                allow: [ Discord.Permissions.FLAGS.VIEW_CHANNEL,
                                    Discord.Permissions.FLAGS.SEND_MESSAGES, 
                                    Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY, 
                                    Discord.Permissions.FLAGS.ATTACH_FILES,
                                    Discord.Permissions.FLAGS.EMBED_LINKS
                                ]
                            },
                            {
                                id: option.support_role,
                                allow: [ Discord.Permissions.FLAGS.VIEW_CHANNEL,
                                    Discord.Permissions.FLAGS.SEND_MESSAGES, 
                                    Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY, 
                                    Discord.Permissions.FLAGS.ATTACH_FILES,
                                    Discord.Permissions.FLAGS.EMBED_LINKS
                                ]
                            }
                        ],

                    });

                    await channel.edit({ parent: category, topic: `${interaction.member.id}-${interaction.customId}` });

                    const embed = new Discord.MessageEmbed();
                    embed.setDescription(`Welcome to your ticket. A staff member will bere here shortly, in the meanwhile please kindly wait for the staff member.\n\n**Creation Reason**\n${option.name}`);
                    embed.setColor(hexToRgb(ticketMenu.embed_colour));
                    embed.setFooter({ text: ticketMenu.embed_footer });
                    embed.setImage(ticketMenu.embed_image);

                    const deleteButton = new Discord.MessageActionRow().addComponents(
                        new Discord.MessageButton()
                        .setEmoji("🔒")
                        .setStyle("DANGER")
                        .setCustomId("closeTicket")
                        .setLabel("Close Ticket")
                    );

                    await channel.send({ content: `<@${interaction.member.id}>`, embeds: [ embed ], components: [ deleteButton ] });
                    await interaction.reply({ content: `Please check the ticket created, thank you.`, ephemeral: true });
                }
            });
        }
    }
}