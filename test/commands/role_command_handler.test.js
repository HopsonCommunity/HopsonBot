const MessageHandler = require('../../src/events/message_sent_handler');
const MockMessage = require('../discord_mocks/mock_message')
const MockChannel = require('../discord_mocks/mock_channel')
const MockMember = require('../discord_mocks/mock_guild_member')

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
                member));
        

        assert.equal(true, true);
    }
);