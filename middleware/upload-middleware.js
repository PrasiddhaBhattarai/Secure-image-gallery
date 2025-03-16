import multer from "multer";
import path from 'path';
import fs from 'fs';

// we only store latest 5 images as server memory is limited/expensive
// Function to manage the number of files in the uploads directory
function manageUploadDirectory(uploadPath, maxFiles = 5) {
    try {
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            return; // No files to manage in a new directory
        }

        // Get all files in the uploads directory
        const files = fs.readdirSync(uploadPath)
            .filter(file => {
                const filePath = path.join(uploadPath, file);
                return fs.statSync(filePath).isFile(); // Only include files, not directories
            })
            .map(file => {
                const filePath = path.join(uploadPath, file);
                // Extract timestamp from filename (assuming format: fieldname-timestamp.ext)
                const timestamp = file.split('-')[1]?.split('.')[0];
                return {
                    name: file,
                    path: filePath,
                    timestamp: timestamp ? parseInt(timestamp) : 0
                };
            });

        // If we have more files than the maximum allowed, delete the oldest ones
        if (files.length >= maxFiles) {
            // Sort files by timestamp (oldest first)
            files.sort((a, b) => a.timestamp - b.timestamp);
            
            // Calculate how many files to delete
            const filesToDelete = files.slice(0, files.length - maxFiles + 1);
            
            // Delete the oldest files
            filesToDelete.forEach(file => {
                fs.unlinkSync(file.path);
                console.log(`Deleted old file: ${file.name}`);
            });
        }
    } catch (error) {
        console.error('Error managing upload directory:', error);
    }
}

//set multer storage
// to store to be uploaded file in local storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve('uploads');
        // console.log(uploadPath);
        // D:\.....\wd\JS_Backend\JS_backend_projects\Nodejs_Auth\uploads
        
        // Manage the upload directory before saving a new file
        manageUploadDirectory(uploadPath);
        
        // Here, you're calling the cb callback function to specify the destination folder.
        cb(null, uploadPath);
        // The null is passed for the first parameter to indicate there is no error.
        // "../uploads/" is the path where the files will be saved.
    },
    filename: function (req, file, cb) {
        // This line calls the callback function (cb) to generate the filename.
        cb(null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
        // <input type="file" name="profilePic" id="profilePic">
        // here, input has the name="profilePic", so when you upload a file through this input, the file.fieldname will be profilePic.
        //here, output: profilePic-1617070700000.jpg.
    }
});

// file filter function
const checkFileFilter = (req, file, cb) => {
    // more explaination about MIME type below
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
        // null: This indicates there is no error.
        // true: This tells the file upload middleware that the file is acceptable and should be processed further.
    } else {
        cb(new Error("Not an image! Please upload only images."));
    }
};

// The multer() function returns a middleware function that can be used in Express routes to handle multipart/form-data, typically used for file uploads.
const uploadMiddleware = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export default uploadMiddleware;


// MIME (Multipurpose Internet Mail Extensions)
// MIME type is a standard that describes the type of data being transmitted over the internet. It helps browsers, email clients, and servers understand how to handle and interpret the data. Originally, MIME types were used in email headers to describe the type of content being sent (text, images, etc.), but now they are widely used for other types of internet communications, including HTTP requests and responses.
//
// A MIME type consists of two parts:
//
// 1) Type : This is the general category of the data (e.g., image, text, audio).
//
// 2) Subtype: This specifies the exact format or encoding of the data within that category (e.g., jpeg, plain, mp3).
//
// eg:
// image/jpeg: This MIME type indicates that the file is an image and uses the JPEG format.