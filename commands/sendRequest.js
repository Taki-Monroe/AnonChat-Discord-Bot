const axios = require('axios');
const config = require('../config');

const sendRequest = (client) => {
    const waitingFor = {};

    const pairRequestListener = async (message) => {
        if (message.author.bot) return;

        const chatId = message.author.id;

        const match = message.content.match(/^\xsendreq$/);
        if (match) {
            // Ask for message
            message.channel.send('What message would you like to include with your pairing request?');
            waitingFor[chatId] = 'message';
        } else {
            const waitingForType = waitingFor[chatId];

            if (waitingForType === 'message') {
                // Send pairing request with message
                const userMessage = message.content;

                const url = 'https://anonchat.xaviabot.repl.co/pair_request/send';
                const data = {
                    uid: chatId,
                    agent_username: config.agent_username,
                    message: userMessage
                };

                try {
                    const response = await axios.post(url, data);
                    const responseData = response.data;
                    if (responseData.success) {
                        const message = `Pairing request sent to other users.`;
                        message.channel.send(message);
                    } else {
                        const errorMessage = responseData.message || 'Error sending request';
                        message.channel.send(errorMessage);
                    }
                } catch (error) {
                    console.error(error);
                    message.channel.send(`${error.message}`);
                }

                // Reset waitingFor state
                delete waitingFor[chatId];
            }
        }
    };

    client.on('messageCreate', pairRequestListener);

    return pairRequestListener;
};

module.exports = sendRequest;