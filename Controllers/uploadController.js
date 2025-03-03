import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Convert import.meta.url to __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure /Files directory exists
const uploadDir = path.join(__dirname, "../Files");

// Normalize the path to avoid issues like double slashes
const normalizedUploadDir = path.normalize(uploadDir);

// Ensure the directory exists
if (!fs.existsSync(normalizedUploadDir)) {
  fs.mkdirSync(normalizedUploadDir);
}

// Configure Multer to save files in /Files/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, normalizedUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File filter to allow only audio files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["audio/mpeg", "audio/wav", "audio/ogg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP3, WAV, and OGG are allowed."), false);
  }
};

// Multer middleware
const upload = multer({ storage, fileFilter });

// Controller function to handle file upload
const uploadAudio = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded or invalid file type" });
  }

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    url: `http://localhost:3000/Files/${req.file.filename}`, // URL for accessing the file
  });
};

// Export both functions using ES6 export
export { upload, uploadAudio };
