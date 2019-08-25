module.exports = class {
    /**
     * Creates a guild member
     * @param {MockUser} user The user assosiated with the member
     * @param {Date} joinDate The date the member joined
     * @param {MockGuild} guild The guild the user is part of
     */
    constructor(user, joinDate, guild) {
        this.roles = [];
        this.joinedAt = joinDate;
        this.guild = guild;
    }

    /**
     * Adds a mock role to the user
     * @param {MockRole} role The role to add to the user
     */
    addRole(role) {
        this.roles.push(role);
    }

    /**
     * Adds a mock role to the user
     * @param {MockRole} role The role to add to the user
     */
    removeRole(role) {
        const index = this.roles.indexOf(role);
        if (index !== -1) this.roles.splice(index, 1);
    }
}