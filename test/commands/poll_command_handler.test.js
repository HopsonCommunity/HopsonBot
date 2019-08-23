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
            messageHandler.handleMessageSentWithoutLog(new MockMessage(">poll yesno", channel, "Tester"), {});

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
            const QUESTION = 'will this test pass?'
            messageHandler.handleMessageSentWithoutLog(new MockMessage(`>poll yesno ${QUESTION}`, channel, "Tester"), {});

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
    "Poll options: Empty args",
    assert => {
        const messageHandler = new MessageHandler();
        const channel = new MockChannel();

        messageHandler.handleMessageSentWithoutLog(new MockMessage(">poll options", channel, "Tester"), {});

        assert.equal(
            channel.lastMessage().content.embed.fields[0].value.startsWith("Unable to poll!"),
            true,
            "Providing options with no question or options should yield a prompt to add a question and options"
        );

        assert.deepEqual(
            channel.lastMessage().content.embed.fields[0].name,
            "*Hopson Polling Station*",
            "The embed should be called Hopson Polling Station"
        );
    }

);

QUnit.test(
    "Poll options: Incorrect args",
    assert => {
        const messageHandler = new MessageHandler();
        const channel = new MockChannel();

        messageHandler.handleMessageSentWithoutLog(new MockMessage(">poll options this is a question", channel, "Tester"), {});
        assert.equal(
            channel.lastMessage().content.embed.fields[0].value.startsWith("Unable to poll!"),
            true,
            "Providing a question without quotations should error"
        );

        messageHandler.handleMessageSentWithoutLog(new MockMessage(`>poll options "this is a question"`, channel, "Tester"), {});
        assert.equal(
            channel.lastMessage().content.embed.fields[0].value.startsWith("Unable to poll!"),
            true,
            "Providing a question without any options should error"
        );

        messageHandler.handleMessageSentWithoutLog(new MockMessage(`>poll options "this is a question`, channel, "Tester"), {});
        assert.equal(
            channel.lastMessage().content.embed.fields[0].value.startsWith("Unable to poll!"),
            true,
            "Providing a question with a single quote should error"
        );

        messageHandler.handleMessageSentWithoutLog(new MockMessage(`>poll options "this is a question" a`, channel, "Tester"), {});
        assert.equal(
            channel.lastMessage().content.embed.fields[0].value.startsWith("Unable to poll!"),
            true,
            "Providing a question with only one option should error"
        );

        messageHandler.handleMessageSentWithoutLog(new MockMessage(`>poll options "this is a question" a b c d e f g h i j k l m`, channel, "Tester"), {});
        assert.equal(
            channel.lastMessage().content.embed.fields[0].value.startsWith("Unable to poll!"),
            true,
            "Providing a question with more than 9 options should error"
        );
    }
)

QUnit.test(
    "Poll options: Correct args",
    assert => {
        const messageHandler = new MessageHandler();
        const channel = new MockChannel();


        messageHandler.handleMessageSentWithoutLog(new MockMessage('>poll options "question asking" a b c d e', channel, "Tester"), {});
        const msg = channel.lastMessage();

        assert.deepEqual(
            msg.content.embed.fields[0].value.startsWith("question asking"),
            true,
            "The polling station should show the question being asked"
        );

        const done = assert.async();
        setTimeout(_ => {
            assert.deepEqual(
                msg.reactions,
                ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣'],
                "Giving 5 options should provide 5 reactions"
            );
            done();
        }, 5000);
    }
);