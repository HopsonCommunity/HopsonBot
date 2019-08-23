const MessageHandler = require('../../src/events/message_sent_handler');
const MockMessage = require('../discord_mocks/mock_message')
const MockChannel = require('../discord_mocks/mock_channel')

QUnit.test(
    "Default command handler tests",
    assert => {
        const messageHandler = new MessageHandler();
        const channel = new MockChannel();

        //Testing command source
        messageHandler.handleMessageSentWithoutLog(new MockMessage(">source", channel), {});

        assert.deepEqual(
            channel.lastMessage().content,
            'https://github.com/HopsonCommunity/HopsonBot',
            "The source command should return the GitHub link of the bot."
        );
    }
)
