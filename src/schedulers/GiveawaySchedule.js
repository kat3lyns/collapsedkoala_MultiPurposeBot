const { EmbedBuilder } = require("@discordjs/builders");
const promisedMySQL = require("../api/promisedMySQL");

module.exports = async(client) => {
    setInterval(async() => {
        const parsedResults = await promisedMySQL(`SELECT * FROM giveaways`);
        for(const result in parsedResults) {
            const thenStamp = parsedResults[result]["end_stamp"];
            const nowStamp = new Date().getTime();

            if(nowStamp >= thenStamp) {
                const channel = await client.channels.cache.get(parsedResults[result]["channel_id"]);
                channel.messages.fetch(parsedResults[result]["message_id"]).then(async(message) => {
                    const winnerCount = parseInt(parsedResults[result]["winners"]);
                    const winners = message.reactions.resolve(`🥳`).users.cache.filter(user => !user.bot).random(winnerCount);
                    const winnersParsed = winners.map(user => `<@${user.id}>`);
                    const embed = message.embeds[0];
                    embed.setDescription(embed.description.replace("Please react below to join the giveaway.", "This giveaway has ended."));
                    embed.setDescription(embed.description.replace(`Winners: ${parsedResults[result]["winners"]}`, `Winners: ${winnersParsed}`));

                    await message.edit({ embeds: [embed] });
                    winners.forEach(async(member) => {
                        await member.send({ embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: "Congratulations!", iconURL: member.displayAvatarURL() })
                                .setColor(0x832dc4)
                                .setDescription(`Hey <@${member.id}>, you won \`${parsedResults[result]["reward"]}\` from the \`${parsedResults[result]["title"]}\` giveaway!`)
                                .setTimestamp(new Date())
                                .setFooter({ text: "Giveaways System" }).data
                        ] });
                    })
                });

                await promisedMySQL(`DELETE FROM giveaways WHERE id=${parsedResults[result]["id"]}`);
            }
        }
    }, 5_000);
}