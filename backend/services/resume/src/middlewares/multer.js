import fs from 'fs';
import multer from 'multer';

const uploadPath = "../uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const stroage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' ) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
}

const upload = multer({ storage: stroage, fileFilter: fileFilter, limits: { fileSize: 15 * 1024 * 1024 } });

export default upload;