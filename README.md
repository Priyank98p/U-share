# U-Share: Campus Peer-to-Peer Rental Marketplace

U-Share is a modern, student-centric peer-to-peer rental marketplace designed exclusively for campus communities. The platform allows students to easily rent out their belongings (such as textbooks, electronics, calculators, and sports equipment) to peers. It promotes a circular economy on campus, making resources more accessible and affordable for students while providing a secure and trusted environment.

---

## Core Features

### User Authentication & Security
- **Secure Onboarding:** JWT (JSON Web Tokens) based authentication.
- **Campus Verification:** Users must upload a valid student ID card to be verified by administrators.
- **Role-Based Access (RBAC):** Distinct roles for 'User' (student) and 'Admin'.
- **Password Management:** Secure password reset flows handled via Resend SDK.

### Marketplace & Item Management
- **Smart Discovery:** Advanced filtering by category, price range, availability dates, and item condition.
- **Item Listings:** Easily create listings with multiple images (hosted on Cloudinary), descriptions, and rental pricing.
- **Trust System:** Integrated review and rating system for both items and users.
- **Wishlist:** Save items for later.

### Booking & Transactions
- **Conflict-Free Bookings:** Robust date overlap validation prevents double-booking.
- **Secure Payments:** Integrated Razorpay for seamless online transactions, with Cash-on-Delivery (COD) support.
- **Order Tracking:** Dedicated "My Rentals" and "My Listings" dashboards to track ongoing requests and rentals.

### Real-Time Communication
- **Live Chat:** Built-in Socket.io messaging allows instant communication between borrowers and owners to negotiate prices or arrange pickup locations on campus.

### Admin Moderation Panel
- **Analytics Dashboard:** Real-time metrics on user growth, active listings, and platform revenue.
- **ID Verification:** Admins review and approve/reject pending student verifications.
- **Content Moderation:** Ability to deactivate or delete prohibited listings and block fraudulent users.

---

## Technology Stack

### Frontend (Client)
- **React.js** + **Vite**
- **Tailwind CSS** (Utility-first styling for a premium UI)
- **Redux Toolkit** (State Management)
- **React Router** (Navigation)
- **Lucide React** & **Framer Motion** (Iconography and Animations)

### Backend (Server)
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose** (Database & Schema Modeling)
- **Socket.io** (Real-time bidirectional event-based communication)
- **JWT & bcrypt** (Authentication & Security)

### Third-Party Integrations
- **Cloudinary:** Cloud-based image management.
- **Razorpay:** Secure payment processing gateway.
- **Resend:** Transactional email service.

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your local machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/u-share.git
   cd u-share
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in both the `server` and `client` directories.
   
   **Server `.env`:**
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

   **Client `.env`:**
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   ```

5. **Run the Application:**
   Open two terminal windows.
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

---

## Security Measures
- **Stateless Auth:** Secure API access via HTTP headers.
- **Data Sanitization:** Strict Mongoose schemas prevent injection attacks.
- **Protected Routes:** Frontend and Backend middlewares ensure sensitive data is only accessible to verified or administrative users.

---
## License
MIT - feel free to use this as a starting point for your own projects.