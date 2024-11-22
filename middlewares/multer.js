import multer from "multer";

const storage= multer.memoryStorage();
const upload = multer({storage:storage,
    limits:{fileSize:5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpg", "image/jpeg","image/png", "image/gif"];
        if(allowedMimeTypes.includes(file.mimetype)){
            cb(null, true);
        }else{
            cb(new Error("Invalid file type. Only JPG, PNG, and GIF are allowed."), false);
        }
    }
})

export default upload;