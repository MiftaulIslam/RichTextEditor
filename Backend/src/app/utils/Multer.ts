import multer, { Multer, FileFilterCallback } from 'multer';
import { Request } from 'express';

// Set up memory storage for multer
const storage = multer.memoryStorage();

// Define the file filter function with proper types
const fileFilter = (
  req: Request, // Express request object
  file: any, // Multer file object
  cb: FileFilterCallback // Callback function for filtering
) => {
  // Optional: filter for specific file types
  const filetypes = /jpeg|jpg|png|gif|pdf|webp/; // Accepts specific file types
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(file.originalname.toLowerCase());

  if (mimetype && extname) {
    return cb(null, true); // Accept the file
  }
  cb(new Error('Error: File type not supported!')); // Reject the file
};

// Create the multer instance with the storage configuration and file size limit
const upload: Multer = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter,
});

// Export the upload instance
export default upload;