const Discord = require('discord.js');
const settings = require('../../../settings.json');
const fs = require('fs');

async function getSuggestions() {
    return require('../../../suggestions.json');
}

async function saveSuggestions(suggestions) {
    fs.writeFile("./suggestions.json", JSON.stringify(suggestions, null, 4), (error) => {
        if(error) console.log(error);
    });
}

async function progressBar(total, current, size = 25, line = '□', slider = '■') {
	if (!total) throw new Error('Total value is either not provided or invalid');
	if (!current && current !== 0) throw new Error('Current value is either not provided or invalid');
	if (isNaN(total)) throw new Error('Total value is not an integer');
	if (isNaN(current)) throw new Error('Current value is not an integer');
	if (isNaN(size)) throw new Error('Size is not an integer');

	if (current > total) {
		const bar = slider.repeat(size + 2);
		const percentage = (current / total) * 100;

		return bar;
	} else {
		const percentage = current / total;
		const progress = Math.round((size * percentage));
		const emptyProgress = size - progress;
		const progressText = slider.repeat(progress);
		const emptyProgressText = line.repeat(emptyProgress);
		const bar = progressText + emptyProgressText;
		const calculated = percentage * 100;

		return bar;
	}
}

module.exports = {
    eventName: 'interactionCreate',
    run: async(client, interaction) => {
        suggestions = await getSuggestions();
        if(!interaction.isButton()) return;

        let suggestionId;
        for(const checkSuggestionId in suggestions) if(suggestions[checkSuggestionId]["message_id"] == interaction.message.id) suggestionId = checkSuggestionId;
        if(!suggestionId) return;

        if(interaction.customId == "suggestion-participants") {
            let content = `**__Suggestion Results__: ID#${suggestionId}\n**`;

            for(let option in suggestions[suggestionId]["participants"]) content += `\n#${parseInt(option) + 1}: ${suggestions[suggestionId]["participants"][option].length >= 1 ? suggestions[suggestionId]["participants"][option].map(userId => `<@${userId}>`).join(`, `) : "`NO USERS`"}`;

            interaction.reply({ content: content, ephemeral: true });
        } else {
            if(!["agree", "disagree"].includes(interaction.customId)) return;

            const converted = interaction.customId == "agree" ? 0 : 1;
            const getConvert = (customId) => customId == "agree" ? 0 : 1;
            interaction.reply({ content: `Thanks for voting!`, ephemeral: true });

            let content = `${suggestions[suggestionId]["suggestion"]}\n\nMade by <@${suggestions[suggestionId]["suggester"]}>\n\`\`\``;
            let total = 0;
            for(let option in suggestions[suggestionId]["participants"]) {
                total += suggestions[suggestionId]["participants"][option].length;
                
                if(suggestions[suggestionId]["participants"][option].includes(interaction.member.id)) suggestions[suggestionId]["participants"][option].splice(suggestions[suggestionId]["participants"][option].indexOf(interaction.member.id));
            } suggestions[suggestionId]["participants"][converted].push(interaction.member.id);

            if(total == 0) total++;

            for(let row in suggestions[suggestionId]["options"]) {            
                content += `#${getConvert(row) + 1} | ${suggestions[suggestionId]["options"][row] == "Agree" ? suggestions[suggestionId]["options"][row] + "   " : suggestions[suggestionId]["options"][row]} | ${await progressBar(total, suggestions[suggestionId]["participants"][row].length)} | ${(suggestions[suggestionId]["participants"][row].length / total) * 100} %\n`;
            } content += `\`\`\`\nClick one of the buttons below to react!`;

            await interaction.message.edit({ embeds: [
                new Discord.MessageEmbed()
                .setColor("BLURPLE")
                .setDescription(content)
                .setTitle(`**__Suggestion__: ID#${suggestionId}**`)
                .setFooter({ text: "Suggestions System" })
                .setTimestamp(new Date())
            ] });
        }

        await saveSuggestions(suggestions);
    }
}