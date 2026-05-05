const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { addFavorite, getUserFavorites, removeFavorite } = require('../controllers/favoriteController');

// @route  POST /api/favorites
// @desc   Add a space to favorites
router.post('/', auth, addFavorite);

// @route  GET /api/favorites/user
// @desc   Get user's favorite spaces
router.get('/user', auth, getUserFavorites);

// @route  DELETE /api/favorites/:id
// @desc   Remove a favorite
router.delete('/:id', auth, removeFavorite);

module.exports = router;
