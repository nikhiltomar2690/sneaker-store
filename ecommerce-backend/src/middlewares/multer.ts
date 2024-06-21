import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads");
  },
  filename(req, file, callback) {
    // uuid is used to generate a unique id
    const id = uuid();
    // extName is used to get the extension of the file
    // pop gives the last element of the array
    const extName = file.originalname.split(".").pop();
    const fileName = `${id}.${extName}`;
    // null is for error handling
    // fileName is the name of the file
    // this will be stored in the uploads folder
    callback(null, fileName);
  },
});

export const singleUpload = multer({ storage: storage }).single("photo");
