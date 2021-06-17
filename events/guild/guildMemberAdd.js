module.exports = (member) => {
    let baseRole = member.guild.roles.cache.find(role => role.name === 'One of Us');

    member.roles.add(baseRole);
}