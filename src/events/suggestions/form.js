const Discord = require('discord.js');
const suggestMenu = require('../../../suggest_menu.json');

module.exports = {
    eventName: 'interactionCreate',
    run: async(client, interaction) => {
        if(!interaction.isButton() || suggestMenu.button.id != interaction.customId) return;

        await interaction.showModal(new Discord.Modal()
            .setCustomId("submitsuggestion")
            .setTitle("Create your suggestion!")
            .setComponents(new Discord.MessageActionRow()
                .setComponents(new Discord.TextInputComponent()
                    .setCustomId("suggestion")
                    .setLabel("Suggestion")
                    .setStyle("PARAGRAPH")
                    .setRequired(true)
                )
            )
        );
    }
}