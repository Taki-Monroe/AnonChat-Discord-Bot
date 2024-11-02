const axios = require('axios');

const changeAccountInfo = (client) => {
    const waitingFor = new Map();

    const changeAccountInfoListener = async (message) => {
        if (message.author.bot) return;

        const chatId = message.author.id.toString();

        if (message.content === 'xchange') {
            message.channel.send('What do you want to change? Reply with name/username/passkey.');
            waitingFor.set(chatId, { type: 'changeType' });
        } else {
            const waitingForObj = waitingFor.get(chatId);
            const waitingForType = waitingForObj && waitingForObj.type;

            if (waitingForType === 'changeType') {
                const changeType = message.content.toLowerCase();

                if (!['name', 'username', 'passkey'].includes(changeType)) {
                    message.channel.send('Invalid option. Please reply with name, username or passkey.');
                    return;
                }

                message.channel.send(`Reply with your new ${changeType}.`);
                waitingFor.set(chatId, { type: 'newValue', changeType });

            } else if (waitingForType === 'newValue') {
                const newValue = message.content;
                const changeType = waitingForObj.changeType;

                message.channel.send('Reply with your passkey.');
                waitingFor.set(chatId, { type: 'passkey', changeType, newValue });

            } else if (waitingForType === 'passkey') {
                const passkey = message.content;
                const uid = chatId.toString();
                const { changeType, newValue } = waitingForObj;

                const data = {
                    uid,
                    passkey
                };

                if (changeType === 'name') {
                    data.newName = newValue;
                } else if (changeType === 'username') {
                    data.newUsername = newValue;
                } else if (changeType === 'passkey') {
                    data.newPasskey = newValue;
                }

                const url = 'https://anonchat.xaviabot.repl.co/menu/change';

                try {
                    const response = await axios.put(url, data);
                    const result = response.data;

                    if (result && result.success) {
                        message.channel.send(`Account ${changeType} changed successfully.`);
                    } else {
                        message.channel.send(`Error changing account ${changeType}: ${result.message}`);
                    }
                } catch (error) {
                    console.error(error);
                    message.channel.send('Error changing account. Please try again.');
                }

                waitingFor.delete(chatId);
            }
        }
    };

    client.on('messageCreate', changeAccountInfoListener);

    return changeAccountInfoListener;
};

module.exports = changeAccountInfo;