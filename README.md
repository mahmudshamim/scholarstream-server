# ScholarStream - Backend API

RESTful API server for the ScholarStream Scholarship Management Platform. Built with Express.js and MongoDB Atlas.

## 🌐 Live API
[API Base URL](https://your-api-url.vercel.app)

## 🎯 Purpose
Provides secure API endpoints for the ScholarStream frontend, handling user authentication, scholarship management, applications, reviews, and payment processing.

## ✨ Key Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👮 **Role-Based Authorization** - Admin, Moderator, Student access control
- 📊 **RESTful API** - Clean and consistent API design
- 🔍 **Advanced Queries** - Search, filter, sort, and pagination
- 💳 **Stripe Integration** - Secure payment intent creation
- 🛡️ **Security Middlewares** - verifyToken, verifyAdmin, verifyModerator

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **JWT** - JSON Web Tokens for auth
- **Stripe** - Payment processing
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing

## 📦 NPM Packages

```json
{
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.17.0",
  "stripe": "^18.1.0"
}
```

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/jwt` | Generate JWT token | Public |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:email` | Get user by email | Token |
| POST | `/users` | Create new user | Public |
| PATCH | `/users/role/:id` | Update user role | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

### Scholarships
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/scholarships` | Get all (with search/filter/sort) | Public |
| GET | `/scholarships/:id` | Get single scholarship | Public |
| POST | `/scholarships` | Create scholarship | Admin |
| PATCH | `/scholarships/:id` | Update scholarship | Admin |
| DELETE | `/scholarships/:id` | Delete scholarship | Admin |

### Applications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/applications` | Get all applications | Moderator |
| GET | `/applications/user/:email` | Get user's applications | Token |
| POST | `/applications` | Create application | Token |
| PATCH | `/applications/status/:id` | Update status | Moderator |
| PATCH | `/applications/feedback/:id` | Add feedback | Moderator |
| DELETE | `/applications/:id` | Delete application | Token |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/reviews/scholarship/:id` | Get scholarship reviews | Public |
| GET | `/reviews/user/:email` | Get user's reviews | Token |
| GET | `/all-reviews` | Get all reviews | Moderator |
| POST | `/reviews` | Create review | Token |
| PATCH | `/reviews/:id` | Update review | Token |
| DELETE | `/reviews/:id` | Delete review | Token/Mod |

### Analytics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/analytics` | Get platform statistics | Admin |

### Payment
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/create-payment-intent` | Create Stripe PaymentIntent | Token |

## 🔐 Security Middlewares

```javascript
// Verify JWT Token
verifyToken(req, res, next)

// Verify Admin Role (must use after verifyToken)
verifyAdmin(req, res, next)

// Verify Moderator Role (must use after verifyToken)
verifyModerator(req, res, next)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Stripe account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/scholarstream-server.git
cd scholarstream-server
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Run development server
```bash
npm run dev
```

## 📁 Project Structure

```
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── analyticsController.js
│   ├── applicationController.js
│   ├── paymentController.js
│   ├── reviewController.js
│   ├── scholarshipController.js
│   └── userController.js
├── middlewares/
│   └── verifyToken.js     # JWT & role verification
├── routes/
│   ├── analyticsReviewRoutes.js
│   ├── applicationRoutes.js
│   ├── scholarshipRoutes.js
│   └── userRoutes.js
├── index.js               # Entry point
└── package.json
```

## 📊 Database Collections

| Collection | Description |
|------------|-------------|
| `users` | User accounts with roles |
| `scholarships` | Scholarship listings |
| `applications` | Student applications |
| `reviews` | Scholarship reviews |

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `ACCESS_TOKEN_SECRET` | JWT signing secret |
| `STRIPE_SECRET_KEY` | Stripe API secret key |

## 📄 License

This project is created for educational purposes.

---

**Built with ❤️ by Mahmud**
