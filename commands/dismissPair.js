const axios = require('axios');
const config = require('../config'); // Replace with your configuration file path

const dismissPair = (client) => {
    const waitingFor = new Map();

    const dismissPairListener = async (message) => {
        if (message.author.bot) return;

        const chatId = message.author.id.toString();

        if (message.content === 'xdismiss') {
            message.channel.send('What is your passkey?');
            waitingFor.set(chatId, { type: 'passkey' });
        } else {
            const waitingForObj = waitingFor.get(chatId);
            const waitingForType = waitingForObj && waitingForObj.type;

            if (waitingForType === 'passkey') {
                const passkey = message.content;

                const url = 'https://anonchat.xaviabot.repl.co/dismiss_pair/dismiss';
                const data = {
                    uid: chatId,
                    passkey: passkey
                };

                try {
                    const response = await axios.post(url, data);
                    const result = response.data;

                    if (result && result.success) {
                        message.channel.send(result.message);
                    } else {
                        message.channel.send(result.message || 'Error dismissing pair');
                    }
                } catch (error) {
                    console.error(error);
                    message.channel.send(error.message || 'Error dismissing pair');
                }

                // Reset waitingFor state
                waitingFor.delete(chatId);
            }
        }
    };

    client.on('messageCreate', dismissPairListener);

    return dismissPairListener;
};

module.exports = dismissPair;