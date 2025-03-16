import { Image } from "../models/image.js";
import { uploadToCloudinary } from "../helpers/cloudinaryHelper.js";
import cloudinary from "../config/cloudinary.js";

const uploadImage = async (req, res) => {
    try {
        // check if file is missing in req object
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image.'
            });
        }

        // upload to cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);

        //delete the file from local storage
        // fs.unlinkSync(req.file.path);

        // store the image details in db
        const newImage = await Image.create({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });

        if (newImage) {
            res.status(201).json({
                success: true,
                message: "Image stored successfully",
                newImage
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Unable to store Image"
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again.'
        });
    }
}

const fetchAllImages = async (req, res) => {
    try {
        const images = await Image.find().limit(10);

        if (images) {
            res.status(200).json({
                success: true,
                images
            })
        } else {
            res.status(400).json({
                success: false,
                message: "No images found"
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again.'
        });
    }
}

// fetch the image according to the page you are in
// each page has limit (no. of images allowed in single page)
const fetchImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;
    
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);
    
        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
        // .sort({ createdAt: 1 });
    
        if (images) {
          res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: totalPages,
            totalImages: totalImages,
            data: images,
          });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again.'
        });
    }
}

// delete single image by public_id
const deleteImage = async (req, res) => {
    try {
        const imageIdToDelete = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(imageIdToDelete);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // admin user who upload the image can only delete it
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You aren't allowed to delete this image."
            });
        }

        // delete from cloudinary storage
        await cloudinary.uploader.destroy(image.publicId);

        //delete the image from mongodb
        await Image.findByIdAndDelete(imageIdToDelete);

        res.status(200).json({
            success : true,
            message : "Image deleted successfully"
        });

    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again.'
        });
    }
};

export { uploadImage };
export { fetchAllImages };
export { fetchImages };
export { deleteImage };