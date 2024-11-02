const axios = require('axios');

const getAccountInfo = (client) => {
    const accountInfoListener = async (message) => {
        if (message.author.bot) return;

        const chatId = message.author.id.toString();

        if (message.content === 'xinfo') {
            const url = `https://anonchat.xaviabot.repl.co/menu/account?uid=${chatId}`;

            try {
                const response = await axios.get(url);
                const accountInfo = response.data;

                if (accountInfo.success) {
                    let infoMessage = `Name: ${accountInfo.name}\nAnonChat Username: ${accountInfo.anonchat_username}`;

                    if (accountInfo.pairing_partner) {
                        infoMessage += `\nPairing Partner:\n  Name: ${accountInfo.pairing_partner.name}\n  AnonChat Username: ${accountInfo.pairing_partner.anonchat_username}`;
                    }

                    message.channel.send(infoMessage);
                } else {
                    message.channel.send(accountInfo.message || 'Failed to retrieve account information');
                }
            } catch (error) {
                console.error(error);
                message.channel.send('Error retrieving account information');
            }
        }
    };

    client.on('messageCreate', accountInfoListener);

    return accountInfoListener;
};

module.exports = getAccountInfo;