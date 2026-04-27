const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const auth = require('../middleware/auth');
const role = require('../middleware/roleCheck');

// @route   POST /api/support
// @desc    Create a new support ticket (for students and teachers)
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { subject, message } = req.body;

        const newTicket = new SupportTicket({
            sender: req.user.id,
            subject,
            message
        });

        const ticket = await newTicket.save();
        
        // Super Adminlarni xabardor qilish
        try {
            const Notification = require('../models/Notification');
            const User = require('../models/User');
            const superAdmins = await User.find({ role: 'super-admin' });
            for (const admin of superAdmins) {
                const newNotif = new Notification({
                    recipient: admin._id,
                    sender: req.user.id,
                    messageText: `Yangi yordam so'rovi: ${subject}`
                });
                await newNotif.save();
            }
        } catch (err) {
            console.error('Admin support notification error:', err.message);
        }
        res.json(ticket);
    } catch (err) {
        console.error('Support creation error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/support/my-tickets
// @desc    Get user's support tickets
// @access  Private
router.get('/my-tickets', auth, async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ sender: req.user.id })
            .populate('sender', 'name role email')
            .populate('replies.sender', 'name role')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        console.error('Fetch my tickets error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/support/all
// @desc    Get all support tickets
// @access  Private (Super Admin)
router.get('/all', [auth, role(['super-admin'])], async (req, res) => {
    try {
        const tickets = await SupportTicket.find()
            .populate('sender', 'name role email')
            .populate('replies.sender', 'name role')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        console.error('Fetch all tickets admin error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/support/:id/reply
// @desc    Reply to a support ticket
// @access  Private (Super Admin)
router.post('/:id/reply', [auth, role(['super-admin'])], async (req, res) => {
    try {
        const { message, status } = req.body;
        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket topilmadi' });
        }

        const replyData = {
            sender: req.user.id,
            message
        };

        ticket.replies.push(replyData);
        if (status) {
            ticket.status = status;
        } else {
            ticket.status = 'closed'; // Default resolving when replied
        }

        await ticket.save();
        
        // Bildirishnoma yuborish
        const Notification = require('../models/Notification');
        const telegramNotify = require('../utils/telegramNotify');
        const msgText = `Sizning "${ticket.subject}" mavzusidagi murojaatingizga javob berildi.`;

        const newNotification = new Notification({
            recipient: ticket.sender,
            sender: req.user.id,
            messageText: msgText
        });
        await newNotification.save();

        // Telegram bildirishnomasi
        await telegramNotify(ticket.sender, `🆘 <b>Yordam markazi - Javob keldi!</b>\n\nMavzu: ${ticket.subject}\n\nJavob: ${message}\n\n<i>Holat: ${status || 'Yopildi'}</i>`);

        // Populate and return updated ticket
        const updatedTicket = await SupportTicket.findById(req.params.id)
            .populate('sender', 'name role email')
            .populate('replies.sender', 'name role');

        res.json(updatedTicket);
    } catch (err) {
        console.error('Reply error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
