const MessageHandler = require('../../src/events/message_sent_handler');
const MockMessage = require('../discord_mocks/mock_message')
const MockChannel = require('../discord_mocks/mock_channel')

QUnit.test(
    "Poll command handler tests",
    assert => {
        const messageHandler = new MessageHandler();
        const channel = new MockChannel();

        //Empty message tests
        {
            messageHandler.handleMessageSent(new MockMessage(">poll yesno", channel), {});
            
            assert.deepEqual(
                channel.lastMessage().embed.fields[0].value,
                "Please add a question.",
                "Providing yesno with no question should yield a prompt to add a question"
            );

            assert.deepEqual(
                channel.lastMessage().embed.fields[0].name,
                "*Hopson Polling Station*",
                "The embed should be called Hopson Polling Station"
            );
        }

        
    }
);