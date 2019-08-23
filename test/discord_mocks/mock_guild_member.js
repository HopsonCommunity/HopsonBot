module.exports = class {
    /**
     * Creates a mock guild member
     */
    constructor() {
        this.roles = [];
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