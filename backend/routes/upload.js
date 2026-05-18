const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// Uploads papkalarini yaratish
const uploadDir = 'uploads/lessons';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage sozlamalari
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.body.type || 'others';
        const typeDir = path.join(uploadDir, type);
        if (!fs.existsSync(typeDir)) {
            fs.mkdirSync(typeDir, { recursive: true });
        }
        cb(null, typeDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// @route   POST api/upload
// @desc    Upload a file
// @access  Private
router.post('/', auth, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'Hech qanday fayl tanlanmadi' });
    }

    // Fayl yo'lini backend URL bilan qaytarish
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const fileUrl = `${protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
    res.json({ url: fileUrl });
});

module.exports = router;
