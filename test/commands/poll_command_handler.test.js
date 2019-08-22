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
            messageHandler.handleMessageSent(new MockMessage(">poll yesno", channel, "Tester"), {});
            
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
            const QUESTION =  'will this test pass?'
            messageHandler.handleMessageSent(new MockMessage(`>poll yesno ${QUESTION}`, channel, "Tester"), {});
            
            assert.deepEqual(
                channel.lastMessage().content.embed.fields[0].value,
                `${QUESTION}`,
                `Asking ${QUESTION} will prompt that question`
            );
            
            const done = assert.async();
            setTimeout(_ => {
                assert.deepEqual(
                    channel.lastMessage().reactions,
                    ['✅', '❌'],
                    `Asking a quesion will give reactions ✅ and ❌`
                );
                done();
            }, 1200);
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
            messageHandler.handleMessageSent(new MockMessage(">poll options", channel, "Tester"), {});

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

        //REAL tests
        {
            messageHandler.handleMessageSent(new MockMessage('>poll options "Question" a b c d e', channel, "Tester"), {});
            const done = assert.async();
            setTimeout(_ => {
                console.log(JSON.stringify(channel.lastMessage()));
                done();
            }, 6000);
            
        }
    }
);