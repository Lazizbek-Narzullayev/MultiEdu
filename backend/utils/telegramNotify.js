const User = require('../models/User');

const sendTelegramNotification = async (recipientId, text) => {
    try {
        const { bot } = require('../bot');
        if (!bot) return;

        const user = await User.findById(recipientId);
        if (user && user.telegramId) {
            // Send message to user's telegramId
            await bot.telegram.sendMessage(user.telegramId, text, {
                parse_mode: 'HTML'
            });
            console.log(`Telegram bildirishnomasi yuborildi: ${user.name}`);
        }
    } catch (err) {
        console.error('Telegram bildirishnoma yuborishda xato:', err.message);
    }
};

module.exports = sendTelegramNotify = sendTelegramNotification;
