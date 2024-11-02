const sendPostRequest = require('../utils/sendPostRequest');

const acceptRequest = (client) => {
    const waitingFor = new Map();

    const acceptRequestListener = async (message) => {
        if (message.author.bot) return;

        const chatId = message.author.id.toString();

        if (message.content === 'xpair') {
            message.channel.send('Who do you want to pair with?');
            waitingFor.set(chatId, 'username');
        } else {
            const waitingForType = waitingFor.get(chatId);

            if (waitingForType === 'username') {
                const username = message.content;

                const url = 'https://anonchat.xaviabot.repl.co/pair_request/accept';
                const data = {
                    uid: chatId,
                    username: username
                };

                try {
                    const result = await sendPostRequest(url, data);

                    if (result && result.success) {
                        message.channel.send(result.message);
                    } else {
                        message.channel.send(result.message || 'Error accepting request');
                    }
                } catch (error) {
                    message.channel.send(error.message || 'Error accepting request');
                }

                waitingFor.delete(chatId);
            }
        }
    };

    client.on('messageCreate', acceptRequestListener);

    return acceptRequestListener;
};

module.exports = acceptRequest;