const axios = require('axios');
const config = require('../config');

const createAccount = (client) => {
    const waitingFor = new Map();
    
    const createAccountListener = async (message) => {
        if (message.author.bot) return;
        
        const chatId = message.author.id.toString();

        if (message.content === 'xcreate') {
            message.channel.send('What is your name?');
            waitingFor.set(chatId, { type: 'name' });
        } else {
            const waitingForObj = waitingFor.get(chatId);
            const waitingForType = waitingForObj && waitingForObj.type;

            if (waitingForType === 'name') {
                waitingFor.set(chatId, { type: 'passkey', name: message.content });
                message.channel.send('What is your passkey?');
            } else if (waitingForType === 'passkey') {
                const name = waitingForObj.name;
                const passkey = message.content;

                const url = 'https://anonchat.xaviabot.repl.co/create_account';
                const data = {
                    uid: chatId,
                    name: name,
                    passkey: passkey,
                    agent_username: config.agent_username // Replace with your own config variable
                };

                try {
                    const response = await axios.post(url, data);
                    const result = response.data;

                    if (result && result.success) {
                        const messageText = `AnonChat account created for ${name}. Your username is ${result.anonchat_username}.`;
                        message.channel.send(messageText);
                    } else {
                        message.channel.send(result.message || 'Error creating account');
                    }

                    // Reset waitingFor state
                    waitingFor.delete(chatId);
                } catch (error) {
                    message.channel.send(`An error occurred: ${error.message}`);
                }
            }
        }
    };

    client.on('messageCreate', createAccountListener);

    return createAccountListener;
};

module.exports = createAccount;