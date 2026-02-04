# Expense Tracker - Full Stack Web Application

A modern, full-featured expense tracking application built with React, Node.js, Express, and MongoDB. Track your expenses, manage budgets, and gain insights into your spending patterns with beautiful visualizations.

![Expense Tracker](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Core Functionality
- **User Authentication** - Secure JWT-based signup and login
- **Expense Management** - Add, edit, delete, and categorize expenses
- **Budget Tracking** - Set monthly budgets with alerts
- **Analytics Dashboard** - Visualize spending with interactive charts
- **Search & Filter** - Find expenses by category, date, or search term
- **CSV Export** - Download your expense history

### 🎨 User Interface
- **Modern Design** - Clean, colorful, and intuitive UI
- **Dark Mode** - Toggle between light and dark themes
- **Responsive** - Works perfectly on mobile, tablet, and desktop
- **Smooth Animations** - Powered by Framer Motion
- **Interactive Charts** - Pie charts, bar charts, and line charts with Recharts

### 🔒 Security
- Password hashing with bcrypt
- JWT token authentication
- Protected API endpoints
- Rate limiting
- Input validation and sanitization

### ⚡ Performance
- Optimized database queries with indexing
- Pagination for large datasets
- Lazy loading and code splitting
- Fast API responses
- Efficient state management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Charting library
- **Axios** - HTTP client
- **React Router** - Routing
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your configuration
# - Set your MongoDB connection string
# - Set a secure JWT secret
# - Configure port (default: 5000)

# Start MongoDB (if not running)
# mongod

# Start the backend server
npm start

# For development with auto-reload
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Request handlers
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   ├── categoryController.js
│   │   ├── budgetController.js
│   │   └── analyticsController.js
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/                  # Database models
│   │   ├── User.js
│   │   ├── Expense.js
│   │   ├── Category.js
│   │   └── Budget.js
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── expenses.js
│   │   ├── categories.js
│   │   ├── budgets.js
│   │   └── analytics.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js               # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/          # Reusable components
    │   │   └── layout/          # Layout components
    │   ├── context/             # React context
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/               # Page components
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── AddExpense.jsx
    │   │   ├── ExpenseHistory.jsx
    │   │   ├── Analytics.jsx
    │   │   └── Profile.jsx
    │   ├── services/            # API services
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   └── expenseService.js
    │   ├── App.jsx              # Main app component
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── .env                     # Environment variables
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 🔌 API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (Protected) |
| PUT | `/api/auth/profile` | Update profile (Protected) |

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses (Protected) |
| GET | `/api/expenses/:id` | Get single expense (Protected) |
| POST | `/api/expenses` | Create expense (Protected) |
| PUT | `/api/expenses/:id` | Update expense (Protected) |
| DELETE | `/api/expenses/:id` | Delete expense (Protected) |
| GET | `/api/expenses/export/csv` | Export to CSV (Protected) |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories (Protected) |
| POST | `/api/categories` | Create category (Protected) |
| PUT | `/api/categories/:id` | Update category (Protected) |
| DELETE | `/api/categories/:id` | Delete category (Protected) |

### Budgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | Get all budgets (Protected) |
| GET | `/api/budgets/status` | Get budget status (Protected) |
| POST | `/api/budgets` | Create budget (Protected) |
| PUT | `/api/budgets/:id` | Update budget (Protected) |
| DELETE | `/api/budgets/:id` | Delete budget (Protected) |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Get overall summary (Protected) |
| GET | `/api/analytics/monthly` | Get monthly breakdown (Protected) |
| GET | `/api/analytics/category-wise` | Get category stats (Protected) |
| GET | `/api/analytics/trends` | Get spending trends (Protected) |

## 🎯 Default Categories

The application comes with 7 default categories:
1. 🍔 Food
2. 🚗 Transport
3. 🛒 Shopping
4. 🎮 Entertainment
5. 💡 Bills
6. ⚕️ Health
7. 📝 Others

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Build for Production

### Backend
```bash
cd backend
# Set NODE_ENV=production in .env
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Build output will be in 'dist' folder
npm run preview  # Preview production build
```

## 🚢 Deployment

### Backend Deployment (Heroku, Railway, DigitalOcean)
1. Set environment variables on your hosting platform
2. Ensure MongoDB connection string is accessible
3. Deploy the backend folder

### Frontend Deployment (Vercel, Netlify, Cloudflare Pages)
1. Build the frontend (`npm run build`)
2. Deploy the `dist` folder
3. Set environment variables (VITE_API_URL)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- UI Framework by [Tailwind CSS](https://tailwindcss.com/)

## 📧 Support

For support, please open an issue in the repository or contact the development team.

---

Built with ❤️ using modern web technologies
