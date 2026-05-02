const Space = require('../models/Space');


// @desc    Create a new space (owner only)
// @route   POST /api/spaces
const createSpace = async (req, res, next) => {
    try {
        const { title, location, price, description, type } = req.body;

        if (!title || !location || !price) {
            return res.status(400).json({ message: 'Title, location and price are required' });
        }

        const space = new Space({
            title,
            location,
            price: Number(price),
            description: description || '',
            type: type || 'room',
            images: [],
            ownerId: req.user.id
        });

        const saved = await space.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// @desc    Get all spaces with filtering and pagination
// @route   GET /api/spaces?location=&minPrice=&maxPrice=&type=&page=&limit=
const getSpaces = async (req, res, next) => {
    try {
        const { location, minPrice, maxPrice, type, page = 1, limit = 10 } = req.query;

        // Build filter object
        const filter = { availability: true };

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }
        if (type) {
            filter.type = type;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [spaces, total] = await Promise.all([
            Space.find(filter)
                .populate('ownerId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Space.countDocuments(filter)
        ]);

        res.json({
            spaces,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get spaces owned by the logged-in user
// @route   GET /api/spaces/my
const getMySpaces = async (req, res, next) => {
    try {
        const spaces = await Space.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
        res.json(spaces);
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a space (owner or admin)
// @route   DELETE /api/spaces/:id
const deleteSpace = async (req, res, next) => {
    try {
        const space = await Space.findById(req.params.id);
        if (!space) {
            return res.status(404).json({ message: 'Space not found' });
        }

        // Only the owner or an admin can delete
        if (space.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this space' });
        }

        await Space.findByIdAndDelete(req.params.id);
        res.json({ message: 'Space deleted successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = { createSpace, getSpaces, getMySpaces, deleteSpace };
