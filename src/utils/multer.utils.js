import multer from "multer";
import fs from "fs";
import path from "path";
import sharp from "sharp";

// Dynamic upload directory based on environment
const uploadDir =
    process.env.NODE_ENV === "production"
        ? path.resolve("/home/prashant/pronolink/public/images")
        : path.join(path.resolve(), "public", "images");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Define multer storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext =
            path.extname(file.originalname) ||
            `.${file.mimetype.split("/")[1]}`;
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

// Initialize multer
const upload = multer({ storage });

// Middleware: Convert uploaded images to WebP
export const compressToWebP = async (req, res, next) => {
    try {
        const files = req.files || (req.file ? [req.file] : []);

        if (!files.length) return next();

        await Promise.all(
            files.map(async (file) => {
                const inputPath = file.path;
                const outputFileName = file.filename.replace(
                    path.extname(file.filename),
                    ".webp"
                );
                const outputPath = path.join(uploadDir, outputFileName);

                await sharp(inputPath)
                    .resize({ width: 1200, withoutEnlargement: true })
                    .webp({ quality: 80, effort: 5 })
                    .toFile(outputPath);

                fs.unlinkSync(inputPath);

                // Update file object
                file.filename = outputFileName;
                file.path = outputPath;
            })
        );

        next();
    } catch (error) {
        console.error("Error compressing image:", error);
        next(error);
    }
};

export default upload;
