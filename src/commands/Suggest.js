const Discord = require('discord.js');
const settings = require('../../settings.json');
const fs = require('fs');

async function getSuggestions() {
    return require('../../suggestions.json');
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
    commandData: {
        name: 'suggest',
        description: 'Create a new suggestion!',
        options: [
            {
                type: 'STRING',
                name: 'suggestion',
                description: 'What you want to suggest.',
                required: true
            }
        ]
    },

    run: async(client, interaction) => {
        await interaction.reply({ content: 'Making your suggestion!', ephemeral: true });
        const suggestionChannel = interaction.guild.channels.cache.get(settings.suggestions_channel);

        const message = await suggestionChannel.send({ content: 'Starting a suggestion...' });

        suggestions = await getSuggestions();
        suggestions[interaction.id] = {};
        suggestions[interaction.id]["suggestion"] = interaction.options.getString("suggestion");
        suggestions[interaction.id]["message_id"] = message.id;
        suggestions[interaction.id]["channel_id"] = message.channel.id;
        suggestions[interaction.id]["options"] = [];
        suggestions[interaction.id]["options"].push("Agree", "Disagree");
        suggestions[interaction.id]["participants"] = {};
        suggestions[interaction.id]["suggester"] = interaction.member.id;

        const firstRow = new Discord.MessageActionRow();
        const secondRow = new Discord.MessageActionRow();
        let content = `${suggestions[interaction.id]["suggestion"]}\n\nMade by <@${interaction.member.id}>\n\`\`\``;

        firstRow.addComponents(new Discord.MessageButton().setCustomId(`agree`).setLabel(`Agree`).setStyle(`SUCCESS`));
        firstRow.addComponents(new Discord.MessageButton().setCustomId(`disagree`).setLabel(`Disagree`).setStyle(`DANGER`));
        secondRow.addComponents(new Discord.MessageButton().setCustomId(`suggestion-participants`).setLabel(`Show Participants`).setStyle(`SECONDARY`));

        for(let row in suggestions[interaction.id]["options"]) {
        
            content += `#${parseInt(row) + 1} | ${suggestions[interaction.id]["options"][row] == "Agree" ? suggestions[interaction.id]["options"][row] + "   " : suggestions[interaction.id]["options"][row]} | ${await progressBar(10, 0)} | 0 %\n`;
            suggestions[interaction.id]["participants"][row] = [];
        } content += `\`\`\`\nClick one of the buttons below to react!`;

        message.edit({ 
            content: null,
            embeds: [
                new Discord.MessageEmbed()
                .setColor("BLURPLE")
                .setDescription(content)
                .setTitle(`**__Suggestion__: ID#${interaction.id}**`)
                .setFooter({ text: "Suggestions System" })
                .setTimestamp(new Date())
            ],
            components: [
                firstRow,
                secondRow
            ]
        });

        await saveSuggestions(suggestions);
        await interaction.editReply({ content: `Created your suggestion! Check it out in <#${settings.suggestions_channel}>`, ephemeral: true });
    }
};