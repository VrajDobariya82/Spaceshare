const express = require('express');
const router = express.Router();
const { auth, isOwner } = require('../middleware/auth');

const { createSpace, getSpaces, getMySpaces, deleteSpace, updateSpace } = require('../controllers/spaceController');

// @route  GET /api/spaces
// @desc   Get all spaces with filtering & pagination
// @access Public
router.get('/', getSpaces);

// @route  GET /api/spaces/my
// @desc   Get spaces owned by the logged-in user
// @access Private (owner)
router.get('/my', auth, isOwner, getMySpaces);

// @route  POST /api/spaces
// @desc   Create a new space
// @access Private (owner)
router.post('/', auth, isOwner, createSpace);

// @route  DELETE /api/spaces/:id
// @desc   Delete a space
// @access Private (owner of space or admin)
router.delete('/:id', auth, deleteSpace);

// @route  PUT /api/spaces/:id
// @desc   Update a space
// @access Private (owner or admin)
router.put('/:id', auth, updateSpace);

module.exports = router;
