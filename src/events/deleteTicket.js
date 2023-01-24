module.exports = {
    eventName: "interactionCreate",
    run: async(bot, interaction) => {
        if(interaction.isButton() && interaction.customId == "deleteTicket") {
            await interaction.channel.delete();
        }
    }
}