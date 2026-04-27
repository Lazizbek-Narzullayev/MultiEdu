const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const auth = require('../middleware/auth');

// POST api/auth/signup
// Talaba yoki O'qituvchi sifatida ro'yxatdan o'tish
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Faqat student yoki teacher bo'lib ro'yxatdan o'tish mumkin
        const allowedRoles = ['student', 'teacher'];
        const selectedRole = allowedRoles.includes(role) ? role : 'student';

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Foydalanuvchi allaqachon mavjud' });
        }

        user = new User({
            name,
            email,
            password,
            role: selectedRole
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        
        // Super Adminlarni xabardor qilish
        try {
            const Notification = require('../models/Notification');
            const superAdmins = await User.find({ role: 'super-admin' });
            for (const admin of superAdmins) {
                const newNotif = new Notification({
                    recipient: admin._id,
                    sender: user._id, // Yangi foydalanuvchi - sender
                    messageText: `Yangi foydalanuvchi ro'yxatdan o'tdi: ${user.name} (${user.role === 'teacher' ? "O'qituvchi" : 'Talaba'})`
                });
                await newNotif.save();
            }
        } catch (err) {
            console.error('Admin notification error:', err.message);
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );
    } catch (err) {
        console.error('Signup xatosi:', err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// POST api/auth/add-user
// Admin yoki Super Admin tomonidan yangi foydalanuvchi qo'shish
router.post('/add-user', auth, async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Faqat admin va super-admin qo'sha oladi
        if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            return res.status(403).json({ msg: 'Sizda foydalanuvchi qo\'shish huquqi yo\'q' });
        }

        // Sub-admin yangi admin qo'sha olmaydi
        if (req.user.role === 'admin' && role === 'admin') {
            return res.status(403).json({ msg: 'Faqat Super Admin yangi admin qo\'sha oladi' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Foydalanuvchi allaqachon mavjud' });
        }

        user = new User({ name, email, password, role });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.json({ msg: 'Foydalanuvchi muvaffaqiyatli qo\'shildi', user: { name, email, role } });
    } catch (err) {
        console.error('User add xatosi:', err.message);
        res.status(500).send('Server xatosi');
    }
});

// POST api/auth/login
// Foydalanuvchi login qilishi
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Bunday email mavjud emas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Parol noto\'g\'ri' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );
    } catch (err) {
        console.error('Login xatosi:', err.message);
        res.status(500).json({ msg: 'Server xatosi', error: err.message });
    }
});

// GET api/auth/users
// Barcha admin va o'qituvchilarni olish (Faqat Admin/Super Admin uchun)
router.get('/users', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            return res.status(403).json({ msg: 'Sizda ruxsat yo\'q' });
        }
        // Faqat admin va teacherlarni qaytaramiz (studentlar kerak emas bu yerda)
        const users = await User.find({ role: { $in: ['admin', 'teacher'] } }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// GET api/auth/admin/all-users
// Barcha foydalanuvchilarni olish (Faqat Super Admin uchun)
router.get('/admin/all-users', auth, async (req, res) => {
    try {
        if (req.user.role !== 'super-admin') {
            return res.status(403).json({ msg: 'Faqat Super Admin barcha foydalanuvchilarni ko\'ra oladi' });
        }
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// GET api/auth/admin/stats
// Admin paneli uchun statistika
router.get('/admin/stats', auth, async (req, res) => {
    try {
        if (req.user.role !== 'super-admin' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Ruxsat etilmagan' });
        }

        const totalUsers = await User.countDocuments();
        const teachers = await User.countDocuments({ role: 'teacher' });
        const students = await User.countDocuments({ role: 'student' });
        const admins = await User.countDocuments({ role: { $in: ['admin', 'super-admin'] } });

        // Bu route uchun courses.js dagi ma'lumot ham kerak bo'lishi mumkin, 
        // lekin biz bu yerda foydalanuvchilar bo'yicha stat beramiz.
        res.json({ totalUsers, teachers, students, admins });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// PUT api/auth/profile
// Foydalanuvchi o'z profilini tahrirlashi
router.put('/profile', auth, async (req, res) => {
    const { name, email } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'Foydalanuvchi topilmadi' });

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ msg: 'Bu email allaqachon band' });
            user.email = email;
        }

        if (name) user.name = name;

        await user.save();

        res.json({
            msg: 'Profil muvaffaqiyatli yangilandi',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// DELETE api/auth/delete-account
// Foydalanuvchi o'z hisobini o'chirishi (parol bilan tasdiqlash)
router.delete('/delete-account', auth, async (req, res) => {
    const { password } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'Foydalanuvchi topilmadi' });

        // Parolni tekshirish
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Parol noto\'g\'ri' });
        }

        // Super admin o'zini o'zi o'chira olmaydi (xavfsizlik uchun)
        if (user.role === 'super-admin') {
            return res.status(403).json({ msg: 'Super Admin hisobini o\'chirib bo\'lmaydi' });
        }

        await User.findByIdAndDelete(req.user.id);
        res.json({ msg: 'Hisobingiz muvaffaqiyatli o\'chirildi' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// DELETE api/auth/user/:id
// Foydalanuvchini o'chirish
router.delete('/user/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'super-admin' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Sizda ruxsat yo\'q' });
        }

        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) {
            return res.status(404).json({ msg: 'Foydalanuvchi topilmadi' });
        }

        // Super admin hech qachon o'chirilmaydi
        if (userToDelete.role === 'super-admin') {
            return res.status(403).json({ msg: 'Bosh adminni o\'chirib bo\'lmaydi' });
        }

        // Sub-admin boshqa adminni o'chira olmaydi
        if (req.user.role === 'admin' && userToDelete.role === 'admin') {
            return res.status(403).json({ msg: 'Faqat Super Admin boshqa adminlarni o\'chira oladi' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Foydalanuvchi o\'chirildi' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// GET api/auth/role/:role
// Rollar bo'yicha foydalanuvchilarni olish (student, teacher)
router.get('/role/:role', auth, async (req, res) => {
    try {
        const { role } = req.params;
        // Faqat student yoki teacherlarni olishga ruxsat beramiz
        if (role !== 'student' && role !== 'teacher') {
            return res.status(400).json({ msg: 'Noto\'g\'ri rol' });
        }

        const users = await User.find({ role }).select('-password').sort({ name: 1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// GET api/auth/telegram/status
// Telegram bog'lanish holatini tekshirish
router.get('/telegram/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('telegramId');
        res.json({ isLinked: !!user.telegramId, telegramId: user.telegramId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// POST api/auth/telegram/generate-token
// Telegram bog'lanish uchun token yaratish
router.post('/telegram/generate-token', auth, async (req, res) => {
    try {
        const crypto = require('crypto');
        const token = crypto.randomBytes(4).toString('hex'); // 8 belgili token
        
        const user = await User.findById(req.user.id);
        user.telegramToken = token;
        user.telegramTokenExpires = Date.now() + 10 * 60 * 1000; // 10 daqiqa amal qiladi
        await user.save();

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// POST api/auth/telegram/unlink
// Telegram bog'lanishni uzish
router.post('/telegram/unlink', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.telegramId = undefined;
        await user.save();
        res.json({ msg: 'Telegram bog\'lanish uzildi' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// POST api/auth/telegram/login
// Telegram Mini App orqali login qilish
router.post('/telegram/login', async (req, res) => {
    const { initData } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!initData || !botToken) {
        return res.status(400).json({ msg: 'Ma\'lumotlar yetarli emas' });
    }

    try {
        const crypto = require('crypto');
        
        // 1. InitData ni tekshirish (Security check)
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        urlParams.delete('hash');
        
        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
        const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

        if (computedHash !== hash) {
            return res.status(401).json({ msg: 'Xavfsizlik tekshiruvidan o\'tmadi' });
        }

        // 2. Foydalanuvchini topish
        const userData = JSON.parse(urlParams.get('user'));
        const telegramId = userData.id.toString();

        let user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ msg: 'Telegram hisobingiz platformaga bog\'lanmagan. Iltimos, avval sozlamalar bo\'limidan bog\'lang.' });
        }

        // 3. JWT yaratish
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );

    } catch (err) {
        console.error('Telegram login error:', err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   PUT api/auth/tracker
// @desc    Update study time and last viewed lesson
// @access  Private
router.put('/tracker', auth, async (req, res) => {
    const { timeToAdd, lastLessonId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'Foydalanuvchi topilmadi' });

        if (timeToAdd) {
            user.timeSpent = (user.timeSpent || 0) + Number(timeToAdd);
        }
        
        if (lastLessonId && lastLessonId !== 'null') {
            user.lastLesson = lastLessonId;
        }

        await user.save();
        res.json({ timeSpent: user.timeSpent, lastLesson: user.lastLesson });
    } catch (err) {
        console.error('Tracker error:', err.message);
        res.status(500).send('Server xatosi');
    }
});

module.exports = router;
