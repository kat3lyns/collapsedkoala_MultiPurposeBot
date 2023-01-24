const settings = require('../../settings.json');

module.exports = {
    eventName: "guildMemberAdd",
    run: async(client, member) => {
        await member.roles.add(settings.autorole_role);
    }
}