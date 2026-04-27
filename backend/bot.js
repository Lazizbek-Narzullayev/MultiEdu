const { Telegraf } = require('telegraf');
const User = require('./models/User');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// /start buyrug'ini ushlab olish
bot.start(async (ctx) => {
    const startPayload = ctx.payload;
    const ngrokUrl = 'https://wholesomely-predoubtful-nyla.ngrok-free.dev';
    const tgId = ctx.from.id.toString();

    try {
        // 1. Allaqachon bog'langanmi shuni tekshiramiz
        const linkedUser = await User.findOne({ telegramId: tgId });
        
        if (linkedUser) {
            return ctx.reply(`✅ Xush kelibsiz qaytadan, ${linkedUser.name}! Sizning hisobingiz platformaga bog'langan.`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🖥 Platformani ochish", web_app: { url: ngrokUrl } }]
                    ]
                }
            });
        }

        // 2. Agar payload yo'q bo'lsa va bog'lanmagan bo'lsa
        if (!startPayload) {
            return ctx.reply("Assalomu alaykum! LMS platformasidagi hisobingizni bog'lash uchun platformadan 'Bog'lanish' tugmasini bosing.", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🖥 Platformani ochish", web_app: { url: ngrokUrl } }]
                    ]
                }
            });
        }

        // 3. Token orqali yangi bog'lash
        const user = await User.findOne({ 
            telegramToken: startPayload,
            telegramTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return ctx.reply("❌ Xatolik: Token noto'g'ri yoki uning muddati tugagan. Iltimos, platformadan qaytadan urinib ko'ring.");
        }

        user.telegramId = tgId;
        user.telegramToken = undefined;
        user.telegramTokenExpires = undefined;
        await user.save();

        ctx.reply(`✅ Muvaffaqiyatli bog'landi! Xush kelibsiz, ${user.name}.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🖥 Platformani ochish", web_app: { url: ngrokUrl } }]
                ]
            }
        });
        
    } catch (err) {
        console.error('Bot xatosi:', err);
        ctx.reply("Serverda xatolik yuz berdi.");
    }
});

// Botni ishga tushirish funksiyasi
const launchBot = async () => {
    if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN.includes('example-token')) {
        console.error('❌ XATO: .env faylida TELEGRAM_BOT_TOKEN o\'rnatilmagan yoki noto\'g\'ri!');
        return;
    }
    
    try {
        await bot.launch();
        console.log('✅ --- Telegram Bot muvaffaqiyatli ishga tushdi ---');
    } catch (err) {
        if (err.message.includes('401')) {
            console.error('❌ XATO: Telegram Bot Tokeni yaroqsiz (401: Unauthorized). Iltimos, @BotFather dan yangi token oling.');
        } else {
            console.error('❌ Botni ishga tushirishda xato yuz berdi:', err.message);
        }
    }

    // Botni to'g'ri to'xtatish (Graceful stop)
    process.once('SIGINT', () => { try { bot.stop('SIGINT'); } catch(e){} });
    process.once('SIGTERM', () => { try { bot.stop('SIGTERM'); } catch(e){} });
};

module.exports = { launchBot, bot };
