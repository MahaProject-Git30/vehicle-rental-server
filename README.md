# 🚗 DriveNow – Vehicle Rental Backend

This is the backend API for the **DriveNow Vehicle Rental Platform** built using **Node.js, Express, and MongoDB**.  
It provides APIs for car listings, bookings, payments, authentication, reviews, wishlist, and admin management.

---

# 📦 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Image Storage)
- Razorpay (Payments)
- Nodemailer (Emails)
- PDFKit (Invoice Generation)
- Multer (File Upload)

---

# 📁 Project Structure

server
│
├── config
│   ├── cloudinary.js
│   ├── db.js
│   ├── mail.js
│   └── razorpay.js
│
├── controllers
│   ├── adminController.js
│   ├── authController.js
│   ├── bookingController.js
│   ├── carController.js
│   ├── paymentController.js
│   ├── reviewController.js
│   └── wishlistController.js
│
├── middleware
│   ├── authMiddleware.js
│   └── upload.js
│
├── models
│   ├── User.js
│   ├── Car.js
│   ├── Booking.js
│   └── Review.js
│
├── routes
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── carRoutes.js
│   ├── paymentRoutes.js
│   ├── reviewRoutes.js
│   └── wishlistRoutes.js
│
├── server.js
└── package.json

---

# ⚙️ Installation

Clone the repository

git clone "my project"

Navigate to backend folder

cd server

Install dependencies

npm install

Run development server

npm run dev

Server runs on:

http://localhost:3008

---

# 🔐 Environment Variables

Create a `.env` file in the root directory.

Example:

PORT=3008

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

⚠️ Do not upload the `.env` file to GitHub.

---

# 👤 Authentication Features

- User Registration
- User Login
- JWT Authentication
- Forgot Password
- Reset Password
- OTP Login Verification

---

# 🚘 Car Features

Users can:

- View available cars
- Search cars by location
- Filter cars by:
  - price
  - fuel type
  - seats
  - transmission
- View car details
- Add reviews
- Add cars to wishlist

Owners/Admin can:

- Add cars
- Update cars
- Delete cars
- Manage vehicle listings

---

# 📅 Booking System

Users can:

- Book cars
- Select start date and end date
- Prevent overlapping bookings
- Cancel bookings
- Download invoice (PDF)

---

# 💳 Payment System

Payments are integrated using **Razorpay**.

Features include:

- Create order
- Verify payment signature
- Automatically create booking after successful payment
- Send booking confirmation email

---

# 📧 Email Notifications

Emails are sent using **Nodemailer** for:

- Password reset
- Booking confirmation
- Become Host requests

---

# ⭐ Review System

Users can:

- Give ratings (1–5 stars)
- Write reviews
- View reviews from other users

---

# ❤️ Wishlist

Users can:

- Add cars to wishlist
- Remove cars from wishlist
- View saved cars

---

# 🛠 Admin Features

Admin dashboard allows:

- View total users
- View total cars
- View total bookings
- View total revenue
- Manage users
- Manage cars
- Manage bookings

---

# 📄 Invoice Generation

After successful booking, users can download a **PDF invoice** containing:

- Customer details
- Car details
- Booking dates
- Payment summary

---

# 🔒 Security

- Password hashing using bcrypt
- JWT authentication
- Role-based authorization
- Razorpay payment verification
- Protected routes using middleware

---

# 🚀 Future Improvements

Possible future features:

- Owner earnings dashboard
- Admin analytics charts
- Car availability calendar
- Booking reminders
- SMS notifications
- Real-time booking updates

---

# 👨‍💻 Author

Developed by **Mahalakshmi R**  
MERN Stack Developer

---

# 📜 License

This project is licensed under the **MIT License**.