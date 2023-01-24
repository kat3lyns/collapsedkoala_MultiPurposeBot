const reactionConfig = require("../../reaction_roles.json");

module.exports = {
    eventName: "messageReactionRemove",

    run: async(client, reaction, user) => {
        if(user.bot) return;
        reactionConfig.options.forEach(async(options) => {
            if(reaction.emoji.name == options.emoji) {
                const role = await reaction.message.guild.roles.cache.get(options.role_id);
                const member = await role.guild.members.fetch(user);

                await member.roles.remove(role);
            }
        });
    }
}