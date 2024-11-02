// import discord.js-light library
const Discord = require('discord.js-light');
const express = require('express');
const bodyParser = require('body-parser');

// create a new discord client
const client = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    makeCache: Discord.Options.cacheWithLimits({
        MessageManager: 200, // keep 200 messages per channel
        UserManager: 100, // keep track of 100 users
    }),
});

// Create express app
const app = express();
app.use(bodyParser.json());

// Import command handlers
// Note: You will need to adapt these for discord.js-light
const createAccount = require('./commands/createAccount')(client);
const sendRequest = require('./commands/sendRequest')(client);
const acceptRequest = require('./commands/acceptRequest')(client);
const sendMessage = require('./commands/sendMessage')(client);
const dismissPair = require('./commands/dismissPair')(client);
const getAccountInfo = require('./commands/getAccountInfo')(client);
const changeAccountInfo = require('./commands/changeAccountInfo')(client);
const deleteAccount = require('./commands/deleteAccount')(client);

app.post('/sendToUser', async (req, res) => {
  const { uid, message } = req.body;
  if (!uid || !message) return res.status(400).send('Bad Request');

  try {
    let user = await client.users.fetch(uid);
    let guild = client.guilds.cache.get('711320797053976583'); // Replace 'Your Guild ID Here' with your actual guild ID
    let channel = guild.channels.cache.get('1087962671715995718'); // Replace 'Your Channel ID Here' with your actual channel ID
    channel.send(`<@${user.id}>\n\n${message}`);
    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

// when the bot is ready, log a message to the console
client.on('ready', () => {
    console.log(`Bot is ready as: ${client.user.tag}`);
});

// when a message is sent in a text channel the bot has access to
client.on('messageCreate', (message) => {
    // if the message is from a bot, ignore it
    if (message.author.bot) return;

    console.log(`Received message: ${message.content}`);

    // You can add your commands here
    if (message.content.startsWith('xhelp')) {
        const helpMessage = 'Available commands:\n' +
        'xcreate - Create an AnonChat account\n' +
        'xac - Send a message\n' +
        'xpair - Pair with a partner\n' +
        'xsendreq - Send a pairing request\n' +
        'xdismiss - Dismiss your current pair\n' +
        'xdelete - Delete your account\n' +
        'xchange - Change your name, username, or passkey\n' +
        'xinfo - View your account information\n';
        
        message.channel.send(helpMessage);
    }

    // Add your other command checks here...
});

// log in to the bot with your token
client.login('MTEwNzIwOTE2MjIyOTgyNTYyNw.GtJzfZ.b3vBzoqSgtz5-vZVg6adGzW0-5fTzSm9CkYgFk');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

console.log('Bot is running...');