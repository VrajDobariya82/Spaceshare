const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const { getAllUsers, deleteUser, getAllSpaces, deleteSpace, getAllBookings } = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(auth, isAdmin);

// @route  GET /api/admin/users
// @desc   Get all users
router.get('/users', getAllUsers);

// @route  DELETE /api/admin/users/:id
// @desc   Delete a user
router.delete('/users/:id', deleteUser);

// @route  GET /api/admin/spaces
// @desc   Get all spaces
router.get('/spaces', getAllSpaces);

// @route  DELETE /api/admin/spaces/:id
// @desc   Delete a space
router.delete('/spaces/:id', deleteSpace);

// @route  GET /api/admin/bookings
// @desc   Get all bookings
router.get('/bookings', getAllBookings);

module.exports = router;
