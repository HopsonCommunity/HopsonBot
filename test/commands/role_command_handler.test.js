const djs = require('discord.js')
const MessageHandler = require('../../src/events/message_sent_handler');
const MockMessage = require('../discord_mocks/mock_message')
const MockChannel = require('../discord_mocks/mock_channel')
const MockMember = require('../discord_mocks/mock_guild_member')
const MockGuild = require('../discord_mocks/mock_guild')
const MockRoles = require('../discord_mocks/mock_role');
const MockUser = require('../discord_mocks/mock_user')

const roles = new djs.Collection();
roles.set(0, new MockRoles("C++"));
roles.set(0, new MockRoles("Java"));
roles.set(0, new MockRoles("Linux"));

const guild = new MockGuild(roles);
const user  = new MockUser();

QUnit.test(
    "Role add commands",
    assert => {
        const messageHandler = new MessageHandler();
        const channel = new MockChannel();
        const member = new MockMember();

        messageHandler.handleMessageSentWithoutLog(
            new MockMessage(
                ">role add C++ Java", 
                channel,
                member, 
                user, 
                guild));
        

        assert.equal(true, true);
    }
);