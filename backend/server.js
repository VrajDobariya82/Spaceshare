require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const spaceRoutes = require('./routes/spaces');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/reviews');
const favoriteRoutes = require('./routes/favorites');
const chatRoutes = require('./routes/chat');
const notificationRoutes = require('./routes/notifications');
const searchRoutes = require('./routes/search');
const paymentRoutes = require('./routes/payments');

const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payments', paymentRoutes);

// Global error handler (must be after routes)
app.use(errorHandler);

// Socket.io — Real-time chat
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication required'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        socket.user = decoded.user;
        next();
    } catch (err) {
        next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.user.id}`);

    // Join a booking chat room
    socket.on('join_room', (bookingId) => {
        socket.join(bookingId);
        console.log(`[Socket] User ${socket.user.id} joined room: ${bookingId}`);
    });

    // Send a message
    socket.on('send_message', async (data) => {
        try {
            const { bookingId, content } = data;
            const message = new Message({
                bookingId,
                senderId: socket.user.id,
                content: content.trim()
            });
            const saved = await message.save();
            const populated = await saved.populate('senderId', 'name');

            // Broadcast to the room
            io.to(bookingId).emit('receive_message', populated);
        } catch (err) {
            console.error('[Socket] Message error:', err);
            socket.emit('error_message', { message: 'Failed to send message' });
        }
    });

    // Leave room
    socket.on('leave_room', (bookingId) => {
        socket.leave(bookingId);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] User disconnected: ${socket.user.id}`);
    });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
