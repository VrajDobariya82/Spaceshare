const express = require('express');
const router = express.Router();
const { autocomplete } = require('../controllers/searchController');

// @route  GET /api/search/autocomplete?q=
// @desc   Get search suggestions
router.get('/autocomplete', autocomplete);

module.exports = router;
