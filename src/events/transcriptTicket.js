const { createTranscript } = require('discord-html-transcripts');
const settings = require('../../settings.json');

module.exports = {
    eventName: "interactionCreate",
    run: async(bot, interaction) => {
        if(interaction.isButton() && interaction.customId == "transcriptTicket") {
            const channel = interaction.guild.channels.cache.get(settings.log_channel);
            await channel.send({ content: "New Transcript!", files: [ await createTranscript(interaction.channel) ] });
        
            await interaction.reply({ content: "Done!", ephemeral: true });
        }
    }
}