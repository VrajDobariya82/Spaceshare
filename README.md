# SpaceShare 🏠

A simple MERN stack platform that connects space **Owners** with **Renters**. Owners can list their available spaces, and Renters can browse and book them.

## Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Frontend   | React (Vite), Tailwind CSS, React Router      |
| Backend    | Node.js, Express.js                           |
| Database   | MongoDB (Mongoose)                            |
| Auth       | JWT + Bcrypt.js                               |
| UI Extras  | React Hot Toast (notifications), Lucide Icons |

## Features

### ✅ Authentication
- User Signup & Login with role selection (Owner / Renter / Admin)
- JWT-based token authentication
- Password hashing with bcrypt

### ✅ Space Listing
- **Owners** can add spaces with title, location, price, and description
- **Owners** can view their own listed spaces
- **Renters** can browse all available spaces

### ✅ Simple Booking
- Renters can click **"Book Now"** on any space
- Booking is saved to the database (userId + spaceId)
- Success/error toast notifications

## Project Structure

```
Spaceshare/
├── backend/
│   ├── models/
│   │   ├── User.js          # User model (name, email, password, role)
│   │   ├── Space.js         # Space model (title, location, price, description, ownerId)
│   │   └── Booking.js       # Booking model (userId, spaceId)
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login
│   │   ├── spaces.js        # POST /spaces, GET /spaces, GET /spaces/my
│   │   └── bookings.js      # POST /bookings
│   ├── server.js            # Express app setup
│   └── .env                 # MONGO_URI, JWT_SECRET, PORT
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Login.jsx          # Login page with role selection
│       │   ├── Signup.jsx         # Registration page
│       │   ├── OwnerDashboard.jsx # Add spaces + view my spaces
│       │   └── RenterDashboard.jsx# Browse spaces + book
│       ├── App.jsx                # Routes
│       └── main.jsx               # Entry point
│
└── README.md
```

## API Endpoints

| Method | Endpoint             | Description            | Auth Required |
| ------ | -------------------- | ---------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user    | No            |
| POST   | `/api/auth/login`    | Login & get JWT token  | No            |
| POST   | `/api/spaces`        | Create a space (owner) | Yes (Owner)   |
| GET    | `/api/spaces`        | Get all spaces         | No            |
| GET    | `/api/spaces/my`     | Get owner's spaces     | Yes (Owner)   |
| POST   | `/api/bookings`      | Book a space           | Yes           |

## How to Run

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running (local or Atlas)

### 1. Backend
```bash
cd backend
npm install
node server.js
```
> Make sure `.env` has `MONGO_URI`, `JWT_SECRET`, and `PORT=5000`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
> Opens at `http://localhost:5173`

## How It Works

1. **Sign up** as an Owner or Renter
2. **Owner** logs in → Adds spaces via the form → Sees listed spaces
3. **Renter** logs in → Browses all spaces → Clicks "Book Now"
4. Booking is saved and a success toast appears 🎉
