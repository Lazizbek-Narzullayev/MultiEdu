require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Global logger (BMI Diognostika uchun qoladi hozircha)
app.use((req, res, next) => {
    console.log(`${req.method} so'rovi keldi: ${req.url}`);
    next();
});

const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Super Admin Seeding Function
const seedSuperAdmin = async () => {
    try {
        const superAdminEmail = 'admin@lms.uz';
        const existingAdmin = await User.findOne({ email: superAdminEmail });

        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            const superAdmin = new User({
                name: 'Bosh Admin',
                email: superAdminEmail,
                password: hashedPassword,
                role: 'super-admin'
            });

            await superAdmin.save();
            console.log('--- SUPER ADMIN yaratildi: admin@lms.uz / admin123 ---');
        } else {
            console.log('--- Super Admin allaqachon mavjud ---');
        }
    } catch (err) {
        console.error('Seeding xatosi:', err);
    }
};

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lms-db';
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
        seedSuperAdmin(); // Bosh adminni yaratish
    })
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/api/auth/test', (req, res) => {
    res.json({ msg: 'Backend ishlayapti!' });
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/messages', require('./routes/messages')); // Added messages route
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/students', require('./routes/students'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/support', require('./routes/support')); // Help Desk API
app.use('/api/models3d', require('./routes/models3d'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/quiz-results', require('./routes/quizResults'));


// Static folder for file uploads
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Telegram botni ishga tushirish
    const { launchBot } = require('./bot');
    launchBot();
});
