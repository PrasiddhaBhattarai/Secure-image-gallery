import mongoose from "mongoose";

// Email regex pattern for validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password regex pattern for validation ( 8 - 15 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

//password will be hashed before storing
// so it might best to validate it before hashing
// i.e. in controller function

const userSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true,
        trim : true,
        maxlength : [20,"Username can have no more than 20 characters!!"]
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
        match: [emailRegex, "Please enter a valid email address!"]  // Email format validation
    },
    password : {
        type : String,
        required : true
        //validate password in controller before hashing
    },
    role : {
        type : String,
        enum : ['user', 'admin'], // only allow "user" or "admin" roles
        default : 'user'
    }
},{timestamps: true});
// In the context of Mongoose, the timestamps: true option is used to automatically add two fields (createdAt and updatedAt) to the schema for the document. These fields are used to track when a document was created and last updated in the database.


export const User = mongoose.model("User", userSchema);