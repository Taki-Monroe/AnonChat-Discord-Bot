const axios = require('axios');
const config = require('../config');

const sendMessage = (client) => {
    const waitingFor = new Map();
    
    const sendToUserListener = async (message) => {
        if (message.author.bot) return;

        const chatId = message.author.id.toString();

        const match = message.content.match(/^xac\s+(.*)/);
        if (match) {
            const userMessage = match[1];

            if (!userMessage) {
                message.channel.send('Please include a message.');
                return;
            }

            const url = 'https://anonchat.xaviabot.repl.co/send_message';
            const data = {
                uid: chatId,
                agent_username: config.agent_username,
                message: userMessage
            };

            try {
                const response = await axios.post(url, data);
                if (response.data && response.data.success) {
                    message.react('✅');
                } else {
                    const errorMessage = response.data && response.data.message ? response.data.message : 'Error sending message';
                    message.channel.send(errorMessage);
                }
            } catch (error) {
                console.error(error);
                message.channel.send(`Error sending message: ${error.message}`);
            }
        } else if (message.content === 'xac') {
            message.channel.send('Please include a message.');
            return;
        }
    };

    client.on('messageCreate', sendToUserListener);

    return sendToUserListener;
};

module.exports = sendMessage;