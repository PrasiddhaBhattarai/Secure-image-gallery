import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { isAdminUser } from "../middleware/admin-middleware.js";
import uploadMiddleware from "../middleware/upload-middleware.js";
import { deleteImage, fetchAllImages, fetchImages, uploadImage } from "../controllers/Image-controller.js";

const router = express.Router();

//upload image
router.post(
    '/upload',
    authMiddleware,
    isAdminUser, 
    uploadMiddleware.single('image'), uploadImage
);

// get all the images
router.get("/get", authMiddleware, fetchAllImages);

// delete image
router.delete('/delete/:id', authMiddleware, isAdminUser, deleteImage);

export default router;

// upload.fields(fields): For handling multiple files in multiple fields.
// 
// upload.fields([
//   { name: "profile_image", maxCount: 1 },
//   { name: "background_image", maxCount: 1 }
// ])
// 
// maxCount: The maximum number of files that can be uploaded.


// upload.array(fieldname, maxCount): For handling multiple files in a specific field.
// 
// upload.array('files', 3)