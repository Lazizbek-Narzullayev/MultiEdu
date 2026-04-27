const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');

// @route   GET api/reviews
// @desc    Get all approved reviews for landing page
// @access  Public
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved' })
            .sort({ date: -1 })
            .populate('user', 'name role');
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

// @route   POST api/reviews
// @desc    Add a new review
// @access  Private
router.post('/', auth, async (req, res) => {
    const { rating, comment } = req.body;

    try {
        const newReview = new Review({
            user: req.user.id,
            rating,
            comment
        });

        const review = await newReview.save();
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server xatosi');
    }
});

module.exports = router;
