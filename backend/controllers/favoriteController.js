const Favorite = require('../models/Favorite');

// @desc    Toggle favorite (add if not exists, info if exists)
// @route   POST /api/favorites
const addFavorite = async (req, res, next) => {
    try {
        const { spaceId } = req.body;
        if (!spaceId) {
            return res.status(400).json({ message: 'spaceId is required' });
        }

        const existing = await Favorite.findOne({ userId: req.user.id, spaceId });
        if (existing) {
            return res.status(400).json({ message: 'Already in favorites' });
        }

        const favorite = new Favorite({ userId: req.user.id, spaceId });
        const saved = await favorite.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// @desc    Get user's favorites
// @route   GET /api/favorites/user
const getUserFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.id })
            .populate({
                path: 'spaceId',
                populate: { path: 'ownerId', select: 'name email' }
            })
            .sort({ createdAt: -1 });
        res.json(favorites);
    } catch (err) {
        next(err);
    }
};

// @desc    Remove a favorite
// @route   DELETE /api/favorites/:id
const removeFavorite = async (req, res, next) => {
    try {
        const fav = await Favorite.findById(req.params.id);
        if (!fav) {
            return res.status(404).json({ message: 'Favorite not found' });
        }
        if (fav.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await Favorite.findByIdAndDelete(req.params.id);
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        next(err);
    }
};

module.exports = { addFavorite, getUserFavorites, removeFavorite };
