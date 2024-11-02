const axios = require('axios');
const config = require('../config'); // Replace with your configuration file path

const deleteAccount = (client) => {
    const waitingFor = new Map();

    const deleteAccountListener = async (message) => {
        if (message.author.bot) return;

        const chatId = message.author.id.toString();

        if (message.content === 'xdelete') {
            message.channel.send('To confirm account deletion, please enter your passkey.');
            waitingFor.set(chatId, { type: 'passkey' });
        } else {
            const waitingForObj = waitingFor.get(chatId);
            const waitingForType = waitingForObj && waitingForObj.type;

            if (waitingForType === 'passkey' && message.content) {
                const passkey = message.content.trim();

                const url = 'https://anonchat.xaviabot.repl.co/menu/delete-account';
                const data = {
                    uid: chatId,
                    passkey: passkey
                };

                try {
                    const response = await axios.put(url, data);
                    const result = response.data;

                    if (result && result.success) {
                        message.channel.send(result.message);
                    } else {
                        message.channel.send(result.message || 'Error deleting account');
                    }
                } catch (error) {
                    console.error(error);
                    message.channel.send(error.message || 'Error deleting account');
                }

                // Reset waitingFor state
                waitingFor.delete(chatId);
            }
        }
    };

    client.on('messageCreate', deleteAccountListener);

    return deleteAccountListener;
};

module.exports = deleteAccount;