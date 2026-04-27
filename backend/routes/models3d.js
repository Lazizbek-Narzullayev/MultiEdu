const express = require('express');
const router = express.Router();
const Model3D = require('../models/Model3D');
const auth = require('../middleware/auth');

// @route   GET api/models3d
// @desc    Get all 3D models
// @access  Public
router.get('/', async (req, res) => {
    try {
        const models = await Model3D.find().sort({ createdAt: -1 });
        res.json(models);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/models3d
// @desc    Add a new 3D model
// @access  Private (Teacher and Admin)
router.post('/', auth, async (req, res) => {
    const { title, category, type, url, thumbnail, description } = req.body;

    try {
        // Check if user is teacher or admin
        if (req.user.role !== 'teacher' && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            return res.status(401).json({ msg: 'Ruxsat berilmagan' });
        }

        const newModel = new Model3D({
            title,
            category,
            type,
            url,
            thumbnail,
            description,
            uploadedBy: req.user.id
        });

        const model = await newModel.save();
        res.json(model);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/models3d/:id
// @desc    Delete a 3D model
// @access  Private (Admin or Uploader)
router.delete('/:id', auth, async (req, res) => {
    try {
        const model = await Model3D.findById(req.params.id);

        if (!model) {
            return res.status(404).json({ msg: 'Model topilmadi' });
        }

        // Check user
        if (model.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            return res.status(401).json({ msg: 'Ruxsat berilmagan' });
        }

        await model.deleteOne();
        res.json({ msg: 'Model o\'chirildi' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
