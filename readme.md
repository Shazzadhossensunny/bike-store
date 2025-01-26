# 🚴‍♂️ Bike Store

# API Link : https://bike-store-livid.vercel.app/

## Overview

The Bike Store is an Express.js application developed with TypeScript, integrating MongoDB using Mongoose. It manages products (bikes) and orders, ensuring data integrity with schema validation, and features robust error handling.

## Features

- **Product Management**: CRUD operations for bikes.
- **Order Management**: Place orders, manage inventory, and calculate revenue.
- **Inventory Control**: Automatically updates stock levels when orders are placed.
- **Data Validation**: Uses Zod for validation.
- **Error Handling**: Returns meaningful error responses for validation and runtime errors.

## Technologies Used

- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **TypeScript**: Strongly typed JavaScript.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **Zod**: Data validation library.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Shazzadhossensunny/bike-store
   cd bike-store
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and configure:

   ```plaintext
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the development server:**
   ```bash
   npm run start:dev
   ```

## API Endpoints

### 🚲 Product Routes

| Method | Endpoint            | Description                       |
| ------ | ------------------- | --------------------------------- |
| POST   | `/api/products`     | Create a new bike product.        |
| GET    | `/api/products`     | Retrieve all bikes (with search). |
| GET    | `/api/products/:id` | Retrieve a specific bike by ID.   |
| PUT    | `/api/products/:id` | Update a bike by ID.              |
| DELETE | `/api/products/:id` | Delete a bike by ID.              |

### Example Product Request

```json
POST /api/products
{
  "name": "Xtreme Mountain Bike",
  "brand": "Giant",
  "price": 1200,
  "category": "Mountain",
  "description": "A high-performance bike built for tough terrains.",
  "quantity": 50,
  "inStock": true
}
```

### 🛒 Order Routes

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| POST   | `/api/orders`         | Place a new order.       |
| GET    | `/api/orders`         | Get all orders.          |
| GET    | `/api/orders/revenue` | Calculate total revenue. |

### Example Order Request

```json
POST /api/orders
{
  "email": "customer@example.com",
  "product": "648a45e5f0123c45678d9012",
  "quantity": 2
}
```

## Inventory Management Logic

- When an order is placed, the product quantity decreases accordingly.
- If the quantity reaches zero, the `inStock` status is set to `false`.
- Insufficient stock returns a validation error.

## Error Handling

The API returns structured error responses. Example:

```json
{
  "message": "Validation failed",
  "success": false,
  "errors": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```
