const Space = require('../models/Space');

// @desc    Autocomplete search for spaces by title or location
// @route   GET /api/search/autocomplete?q=
const autocomplete = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.json([]);
        }

        const regex = new RegExp(q, 'i');
        const spaces = await Space.find({
            availability: true,
            $or: [
                { title: regex },
                { location: regex }
            ]
        })
            .select('title location type price')
            .limit(8)
            .sort({ createdAt: -1 });

        res.json(spaces);
    } catch (err) {
        next(err);
    }
};

module.exports = { autocomplete };
