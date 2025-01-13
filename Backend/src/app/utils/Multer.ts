import multer, { Multer } from 'multer';

// Set up memory storage for multer
const storage = multer.memoryStorage();

// Create the multer instance with the storage configuration and file size limit
const upload: Multer = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
    fileFilter: (req, file, cb) => {
        // Optional: filter for specific file types
        const filetypes = /jpeg|jpg|png|gif|pdf|webp/; // Accepts specific file types
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(file.originalname.toLowerCase());

        if (mimetype && extname) {
            console.log(file)
            return cb(null, true);
        }
        cb(new Error('Error: File type not supported!'));
    },
});

// Export the upload instance
export default upload;
