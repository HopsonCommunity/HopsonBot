# HopsonBot
HopsonBot is a Discord bot for the [Hopson Community Server](https://discordapp.com/invite/xvQaysR), written using Discord.js.

## Contributing
### Getting the bot to work
#### Getting the bot and the environment for it
Create a new server. You can also use an existing one as long as you're an admin on said server, but this should be avoided since you testing the bot may annoy other members on said server.

After creating the server (or after you decided not to create one) hop onto [this](https://discordapp.com/developers/applications/me) website.
Log in if you haven't already and click the "New App" button.
This "app" will become the Hopson Bot. Give it any name and a profile picture if you wish. Press the "Create App" button when you're done. 

You should be on your bot's info screen at this point. Scroll down a bit to the section named "Bot" and click the blue/purple button which says "Create a Bot User." This turns your "app" into a bot.

#### Getting the bot onto your server
Keep your bot's info page open and go to [this link](https://discordapi.com/permissions.html).
Tick the box that says "Administrator" on the big list of permissions. This will make your bot an admin when it joins the server. You don't need to enable any of the other boxes since administrator = can do everything. Probably.

A bit below the boxes are some other things. There's a text field with the text "Client ID". Keep this in mind.

Now go to your bot's info page. Use your browser's search-inside-page function (CTRL+F) to search for the text "Client ID". You can look for it yourself as well, it's somewhere near the top.

If you found the "Client ID" text you can see that there is a long string of random numbers next to it. This is your bot's user ID, or formally known as "Client ID." Go ahead and copy this ID.

Now go back to the permissions calculator page (the one I linked you to earlier!). Paste the ID into the text field that says "Client ID" (I hope you kept this text field in mind like I told you!). If the line under the field turns green, you're ready to continue reading. Double-check that you've enabled the "Administrator" permission near the top. 

Now go to the bottom of the page. There's a big link. Click that link. There's a drop-down selection menu. Click it and select the server you want the bot to go to. After you've done that, press the big blue/purple button at the bottom. Confirm that you are not a bot yourself and you're good to go. Close the window/tab when the site tells you to.

If everything went well, your bot should now be on the selected server. Congratulations.

#### Running the bot
I'll assume you know how to use Git and GitHub. Fork this repository and clone the fork onto your PC.
You'll need to download [Node.js](https://nodejs.org/) for the bot to work. You also need npm to download the necessary packages, but Node.js usually installs npm for you.

After you've installed Node.js (and npm), open up a terminal window (command prompt for Windows users) and navigate to the repository which you cloned. Type the command `npm install` to download all the necessary packages that Node.js will use while running the bot. If your terminal/command prompt complains about there being no "npm" in your system, go ahead Google how to download and install npm manually.

After npm has finished downloading every package, go to the "data" folder and create a new file named "config.json". In order for the bot to work your bot's token needs to be specified in this file. Type the following text into the file:
```javascript
{
    "token": "placeholder"
}
```
After you've typed all that text into config.json, navigate back to your bot's info page. [Here's a link to the "My Apps" page.](https://discordapp.com/developers/applications/me)

.
Time to utilize your browser's in-page search function once again! Hit CTRL+F and search for the text "token". Navigate to the topmost result.
It should say "Token: click to reveal." Click it.

The long string of random characters is your bot's token. This token is basically your bot's password, so don't share it to anyone unless you want them to have access to the bot.

Copy this token and go back to the config.json file you created. You can see that the key named "token" has a value of "placeholder". Replace the text "placeholder" with your bot's token.

Go back to your terminal/command prompt. Type in another command, `npm start`. This will run the "start" script that is located in the package.json file. If everything goes right, it should say something about the bot logging in and such. This is good. Go back to the server where you added the bot into. The bot should be online.

To test if everything works, type \>help into the chat. If the bot responds with a list of commands, you've done everything right. Good job. If it does not, check your terminal/command prompt window where you ran `npm start`. It should be lit with errors. Read trough them and try to debug. There are too many things that can go wrong, so I can't really help you debug the errors from here (here = this README).


### A guide for how to create your own commands is coming soon. m1ksu is very tired from writing all this. 
