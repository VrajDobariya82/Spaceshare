const multer = require('multer');

// Use memory storage — files will be uploaded to Cloudinary, not stored on disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max per file
        files: 5 // Max 5 files at once
    }
});

module.exports = upload;
