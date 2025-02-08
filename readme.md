# 🚴‍♂️ Bike Store

## API Link

[Live Backend API](https://bike-store-livid.vercel.app/)

## Overview

Bike Store is a **Node.js and Express.js** application built with **TypeScript**, using **MongoDB** as the database. It provides a complete backend solution for managing bike products, orders, authentication, and payments. The system ensures secure user authentication, efficient inventory management, and robust error handling.

## 🚀 Features

- **User Authentication**: Secure login, signup with **access & refresh tokens**.
- **Password Security**: Password hashing using **bcrypt** before saving to the database.
- **Product Management**: Add, update, delete, and fetch products.
- **Order Management**: Place orders, update order status, and manage inventory.
- **Payment Integration**: Uses **SurjoPay** for secure transactions.
- **Backend Pagination & Filtering**: Optimized data retrieval with **pagination, sorting, and filtering**.
- **Global Error Handling**: Centralized error management for better debugging.
- **Middleware & Security**: Implements **authentication middleware, role-based access, and request validation**.
- **Not Found Handling**: Handles invalid routes with proper responses.

## 🛠 Technologies Used

- **Node.js & Express.js** - Server-side framework
- **TypeScript** - Strongly typed JavaScript
- **MongoDB & Mongoose** - NoSQL database & ODM
- **Zod** - Schema validation
- **Bcrypt** - Secure password hashing
- **JSON Web Token (JWT)** - Secure authentication & authorization
- **SurjoPay** - Payment gateway integration

## 📌 Installation & Setup

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/Shazzadhossensunny/bike-store.git
cd bike-store
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Configure Environment Variables**

Create a `.env` file in the root directory and add:

```plaintext
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

### **4️⃣ Start the Development Server**

```sh
npm run start:dev
```
