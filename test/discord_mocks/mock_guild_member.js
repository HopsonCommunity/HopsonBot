module.exports = class {
    constructor() {
        this.roles = [];
    }

    addRole(role) {
        this.roles.push(role);
    }

    removeRole(role) {
        this.roles.pop(role);
    }
}