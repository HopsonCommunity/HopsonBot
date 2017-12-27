# HopsonBot
Discord bot for the Hopson Community Server, written using Discord.js

## Contributing
### Getting the bot to work
#### Create the bot and the environment for it
Create a new server. You can also use an existing as long as you're an admin on said server, but this should be avoided since you testing the bot may annoy other members on this server.

After creating the server (or after you decided not to create one) navigate to [this](https://discordapp.com/developers/applications/me) website.
Log in if you haven't already and click the "New App" button.
This "app" will be the Hopson Bot on your server. Give it any name (and a profile picture if you wish). Press the "Create App" button when you're done. 

You should be on your bot's info screen at this point. Scroll down a bit to the section named "Bot" and click the blue/purple button which says "Create a Bot User". This turns your "app" into a bot.

#### Getting the bot onto your server
Keep your bot info page open and go to [this link](https://discordapi.com/permissions.html).
Tick the box that says "Administrator" on the big list of permissions. This will make your bot an admin when it joins the server. You don't need to enable any of the other boxes (probably) since administrator = can do everything. Probably.

A bit below the boxes are some other things. There's a text box with the title "Client ID". Keep this in mind.

Now go to your bot's info page. Use your browser's search-inside-page function (CTRL+F) and search for "Client ID". You can look for it yourself as well, it's somewhere near the top.

If you found the "Client ID" text you can see that there is a long string of random numbers next to it. This is your bot's user ID, or formally known as "Client ID". Go ahead and copy this id.

Now go back to the permissions calculator page (the one I linked you to earlier!). Paste the ID to the box that says "Client ID" (I hope you kept the box in mind like I told you!). If the line under the text box turns green, you're ready to continue reading. Double-check that you've enabled the "Administrator" permission near the top. 

Now go to the bottom of the page. There's a big link. Click the link. There's a drop-down selection thingy. Click it and select the server you want the bot to go to. After you've done that, press the big blue/purple button at the bottom. Confirm that you are not a bot yourself and you're good to go. Close the window/tab when Discord tells you to.

If everything went well, your bot should now be on the selected server. Congratulations.

Fork the repository or clone the repository to your PC.
Create a file named "config.json" into the "data" folder.

> Put your config into the "data" folder.
> Config must be named config.json or config.js.
> Config needs to contain at least a key named "token" with your bot's token as its value.
