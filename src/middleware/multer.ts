import multer from "multer";

class Multer {
    upload: multer.Multer

    constructor() {
        const storage = this.createStorage()
        this.upload = multer({storage});
    }

    createStorage = () => {
        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "public/uploads")
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + "-" + file.originalname)
            }
        })
    }

}

export default Multer;