const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config({ path: './backend/.env' });

const resetTelegram = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
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
