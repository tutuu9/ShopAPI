# Shop API

Backend for an online shop built with Node.js and Express.

---

## Tech stack

* Node.js
* Express
* MongoDB (Mongoose)
* JWT
* bcrypt

---

## How to run

```bash
git clone https://github.com/your-username/ShopAPI.git
cd ShopAPI
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
```

Run server:

```bash
npm run dev
```

---

## API

### Auth

POST `/api/auth/register` — register user
POST `/api/auth/login` — login

---

### Products

GET `/api/products` — get all products
GET `/api/products/:id` — get product by id

POST `/api/products` — create product (admin)
PUT `/api/products/:id` — update product (admin)
DELETE `/api/products/:id` — delete product (admin)

Supports:

* search (`?search=`)
* category filter (`?category=`)
* price (`?minPrice=&maxPrice=`)
* pagination (`?page=&limit=`)
* sorting (`?sort=`)

---

### Cart

GET `/api/cart` — get user cart

POST `/api/cart` — add product to cart
PUT `/api/cart/:productId` — update quantity
DELETE `/api/cart/:productId` — remove item
DELETE `/api/cart` — clear cart

---

### Orders

POST `/api/orders` — create order

GET `/api/orders/my` — get user orders

GET `/api/orders` — get all orders (admin)
PUT `/api/orders/:id` — update order status (admin)

---

## Notes

* protected routes require JWT token
* admin routes require role = admin
