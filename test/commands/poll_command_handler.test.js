const MessageHandler = require('../../src/events/message_sent_handler');
const MockMessage = require('../discord_mocks/mock_message')
const MockChannel = require('../discord_mocks/mock_channel')

const POLL_STATION_NAME = "*Hopson Polling Station*";

QUnit.test(
    "Poll yesno command tests",
    assert => {
        const messageHandler = new MessageHandler();
        const channel = new MockChannel();

        //Empty message tests
        {
            messageHandler.handleMessageSent(new MockMessage(">poll yesno", channel), {});
            
            assert.deepEqual(
                channel.lastMessage().content.embed.fields[0].value,
                "Please add a question.",
                "Providing yesno with no question should yield a prompt to add a question"
            );

            assert.deepEqual(
                channel.lastMessage().content.embed.fields[0].name,
                "*Hopson Polling Station*",
                "The embed should be called Hopson Polling Station"
            );
        }

        //Non-Empty tests
        {
            messageHandler.handleMessageSent(new MockMessage(">poll yesno Will this test pass?", channel), {});
            
        }
    }
);

QUnit.test(
    "Poll options command tests",
    assert => {
        const messageHandler = new MessageHandler();
        const channel = new MockChannel();

        //Empty message tests
        {
            messageHandler.handleMessageSent(new MockMessage(">poll options", channel), {});

            assert.deepEqual(
                channel.lastMessage().content.embed.fields[0].value,
                "Please add a question, followed by 2 or more choices",
                "Providing options with no question or options should yield a prompt to add a question and options"
            );

            assert.deepEqual(
                channel.lastMessage().content.embed.fields[0].name,
                "*Hopson Polling Station*",
                "The embed should be called Hopson Polling Station"
            );
        }

        //Yes
    }
);