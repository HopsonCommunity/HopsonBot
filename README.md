# HopBot

Bot for my Discord community server.

# Dependancies
Requies Node.js 6.0 and over, and Discord.js

# Adding Commands

This is done in the [bot_replies.js](https://github.com/HopsonCommunity/HopsonBot/blob/master/scripts/bot_replies.js) file.

There are two types of commands: Simple, and Complex.

To create a new command, it is as easy as adding it to one of the dictionaries.

```js
var simpleReplies =  {
    ...
}

//Complex replies call functions
var complexReplies = {
    ...
}
```

Once added to one of these, it will just work.

The key of these maps is "String" and the value is an object of type `Reply`, which takes up to 3 parameters: `action`, `description`, `acceptsArgs`.

action: This is either a message (simple replies) or a function (complex replies). Complex reply functions must take in two args: `message`, which is the object representing a user's message to the Discord channel, and `args`, which is a list of arguments after the command. For example, for `echo`, args is the message to echo.

#### Simple Replies:
These are replies/ commands which do nothing except output some (hardcoded) text.

For example, the command `"Source"`:

```js
var simpleReplies =  {
    "source" : new Reply("You can find my source code here: https://github.com/HopsonCommunity/HopsonBot !", "Gives GitHub link of the bot's source code"),
}
```


#### Complex Replies:
These are replies/ commands which call a function.

For example the command `"echo"`:

//Complex replies call functions

```js
var complexReplies = {
    "echo":     new Reply (sendEcho, "Echoes the user's message", true),
}
```

Where `sendEcho` is:

```js
function sendEcho(message, args)
{
    if (args.length) {
        send(message, args.join(' '));
    } else {
        send(message, "You didn't give me anything to echo :(");
    }
}
```


## Helpful functions

Some commands can only be used by Admins. To make your command admin-only, you can check by calling the `isSentByAdmin` function.

Eg
```js
function sendRoleUsers(message, args) 
{
    if (!isSentByAdmin(message)) {
        send(message, "Sorry, this command is for admins only.");
        return;
    }
    ...
    ...
}
```