import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Password regex pattern for validation ( 8 - 15 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

// register controller
const registerUser = async (req, res) => {
    try {
        // The destructuring assignment syntax
        const { username, email, password, role } = req.body;
        // the variable names in destructuring assignment should exactly match with the keys(property names) in req.body

        //check if user already exists in db
        // only returns username and email
        const checkExistingUser = await User.findOne(
            {$or : [{username}, {email}]},
            'username email'
        );
        
        if (checkExistingUser) {
            const matchedData = (email === checkExistingUser.email)? 'email':'username';
            //if email is matched, can redirect them to login page
            if (matchedData === 'email') {
                return res.status(400).json({
                    success: false,
                    message: `Your email is already registered. Please login instead.`
                });
            };
            return res.status(400).json({
                success: false,
                message: `User already exists for provided ${matchedData}. Please try again with new one.`
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be of (8-15) characters with at least one uppercase letter, one lowercase letter, one number and one special character!"
            });
        }

        //hash user password
        const salt = await bcrypt.genSalt(10);
        
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // create a new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        if (newUser) {
            res.status(201).json({
                success: true,
                message: "User registered successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Unable to register User"
            });
        }

    } catch (error) {
        console.error("error in registering user!", error);
        res.status(500).json({
            success: false,
            message: 'Some error occured! Please try again'
        });
    }
}

// login controller
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;

        // find if the user exists in db
        const findUser = await User.findOne({username});
        if (!findUser) {
            return res.status(400).json({
                success : false,
                message : "User doen't exist!"
            });
        }

        // if the password is correct or not?
        const isPassowrdMatch = await bcrypt.compare(password, findUser.password);
        if (!isPassowrdMatch) {
            return res.status(400).json({
                success : false,
                message : "invalid credentials!"
            });
        }
        
        //create user token
        const accessToken = jwt.sign({
            userId : findUser._id, 
            username : findUser.username,
            role : findUser.role,
            email : findUser.email,
            createdAt : findUser.createdAt
        }, process.env.JWT_SECRET_KEY, {
            expiresIn : '15m'
            // token expires in 15 mins
        });

        // Set the token as an HTTP-only cookie
        res.cookie('jwt', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
            sameSite: 'strict' // Protect against CSRF
        });

        // Return user info (but not the token)
        res.status(200).json({
            success : true,
            message : "logged in successfully",
            user: {
                userId: findUser._id,
                username: findUser.username,
                role: findUser.role
            }
        });

    } catch (error) {
        console.error("error in user login!", error);
        res.status(500).json({
            success: false,
            message: 'Some error occured! Please try again'
        });
    }
};

const changePassword = async(req, res) => {
    try {
        const userId = req.userInfo.userId;

        // extract old and new password
        const {oldPassword, newPassword} = req.body;

        // find the current logged in user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                success : false,
                message : 'user not found'
            });
        };

        //check if the old password is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success : false,
                message : 'old password is incorrect! Please try agian.'
            });
        };

        //hash the new passwrod
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        // update user password
        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success : true,
            message : 'Password changed successfully.'
        });

    } catch (error) {
        console.error("error in changing password.", error);
        res.status(500).json({
            success: false,
            message: 'Some error occured! Please try again'
        });
    }
};

// logout controller
const logoutUser = async (req, res) => {
    try {
        // Clear the JWT cookie
        res.clearCookie('jwt');
        
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Error in user logout!", error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred! Please try again'
        });
    }
};

export { registerUser, loginUser, changePassword, logoutUser };