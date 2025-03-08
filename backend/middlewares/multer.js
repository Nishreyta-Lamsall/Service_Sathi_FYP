import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const uploadDir = "./uploads"; // Directory where images will be stored
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    }
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    callback(null, uniqueSuffix + fileExtension); // Generate a unique filename
  },
});

const upload = multer({ storage });

export default upload;
