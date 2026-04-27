const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const resetTelegram = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lms-db';
        await mongoose.connect(uri);
        console.log('MongoDB ga ulanish amalga oshirildi.');

        const result = await User.updateMany(
            {}, 
            { 
                $unset: { 
                    telegramId: "", 
                    telegramToken: "", 
                    telegramTokenExpires: "" 
                } 
            }
        );

        console.log(`${result.modifiedCount} ta foydalanuvchidan Telegram ma'lumotlari o'chirildi.`);
        process.exit(0);
    } catch (err) {
        console.error('Xatolik:', err);
        process.exit(1);
    }
};

resetTelegram();
