# 🚀 Node.js Authentication & Image Upload System

A secure and scalable **authentication and image upload platform** built using **Node.js**, **Express**, **MongoDB**, **JWT**, and **Cloudinary**. This full-stack project enables secure user registration and login, role-based access for admin features, password management, and image gallery functionality.

---

## ✨ Features

- 🔐 **User Authentication**  
  Secure login/registration with JWT & bcrypt (password hashing) using HTTP-only cookies.

- 🛡️ **Role-Based Access Control**  
  Distinct routes and features for users and administrators.

- 🔁 **Password Management**  
  Secure password change functionality with strong validation.

- ☁️ **Image Upload & Gallery**  
  Admins can upload images (stored on Cloudinary) and view/manage their gallery.

- 🎨 **Responsive UI**  
  Clean and responsive frontend using **EJS** and **CSS**.

- 🍪 **Session Management**  
  Cookie-based session handling for persistent and secure authentication.

- 📁 **File Handling with Multer**  
  Images are handled with server-side validation before being uploaded to Cloudinary.

---

## LINK FOR THE WEBSITE
```
https://node-js-auth-eqvd.onrender.com
```

---

## 📁 Project Structure

```bash
.env
.gitignore
package.json
server.js

config/
  └── cloudinary.js

controllers/
  ├── auth-controller.js
  └── image-controller.js

database/
  └── db.js

helpers/
  └── cloudinaryHelper.js

middleware/
  ├── admin-middleware.js
  ├── auth-middleware.js
  └── upload-middleware.js

models/
  ├── image.js
  └── user.js

public/
  ├── css/
  │   └── styles.css
  └── js/
      ├── main.js
      ├── login.js
      ├── register.js
      ├── dashboard.js
      ├── admin.js
      ├── upload.js
      ├── change-password.js
      └── index.js

routes/
  ├── admin-routes.js
  ├── auth-routes.js
  ├── home-routes.js
  └── image-routes.js

uploads/
  └── (Local uploaded images managed by Multer)

views/
  ├── layout.ejs
  ├── index.ejs
  ├── login.ejs
  ├── register.ejs
  ├── dashboard.ejs
  ├── admin.ejs
  ├── upload.ejs
  └── change-password.ejs
```

---

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd 04_Nodejs_Auth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET_KEY=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Or for production:

   ```bash
   npm start
   ```

5. **Access the Application**

   Open your browser and visit:  
   👉 [http://localhost:3000](http://localhost:3000)

---

## 🚧 Usage Overview

| Action             | Description |
|--------------------|-------------|
| 📝 **Register**       | Create a new user account |
| 🔐 **Login**          | Log in to your user dashboard |
| 👤 **Dashboard**      | View your profile and image gallery |
| 🔄 **Change Password**| Securely update your password |
| 🛠️ **Admin Dashboard**| Admin users can view and manage all images |
| ☁️ **Image Upload**   | Admins can upload images to Cloudinary |

---

## ⚙️ Technologies Used

- **Node.js** & **Express** – Backend server and RESTful routing  
- **MongoDB** & **Mongoose** – Database and schema modeling  
- **JWT (jsonwebtoken)** – Token-based authentication  
- **bcryptjs** – Secure password hashing  
- **multer** – Middleware for image/file uploads  
- **Cloudinary** – Cloud image storage and management  
- **EJS** – Server-side templating engine  
- **CSS** – Responsive front-end styling

---

## 🔒 Security Features

- 🔑 Passwords are hashed using bcrypt before storing  
- 🧠 JWT tokens stored securely in HTTP-only cookies  
- 🚫 Role-based access control (RBAC) to limit admin features  
- 🧼 Input validation for registration/login/password change  
- 🖼️ Only image files are accepted for upload

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Prashidha Bhattarai**  
Feel free to **fork**, **contribute**, or use this project for your own learning and development needs.
