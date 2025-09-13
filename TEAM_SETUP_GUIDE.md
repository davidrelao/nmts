# 🏛️ Museum Reservation System - Team Setup Guide

## Quick Start for Team Members

This guide will help you set up and run the Museum Reservation System on your local machine after pulling from Git.

## 📋 Prerequisites

Before you start, make sure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **Git** installed
- **MySQL** installed locally OR access to a remote database

## 🚀 Step-by-Step Setup

### Step 1: Clone/Pull the Repository

```bash
# If cloning for the first time
git clone <your-repository-url>
cd museum-reservation

# If you already have the repo, just pull latest changes
git pull origin main
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

```bash
# Copy the example environment file
cp env.example .env
```

Now edit the `.env` file with your database settings:

```env
# Database - Choose ONE option below:

# Option 1: Local MySQL (if you have MySQL installed locally)
DATABASE_URL="mysql://root:password@localhost:3306/museum_reservation"

# Option 2: Remote Database (if using a shared database)
DATABASE_URL="mysql://username:password@remote-host:3306/museum_reservation"

# NextAuth (keep these as default for local development)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
JWT_SECRET="your-jwt-secret-here"
```

### Step 4: Set Up Database

#### Option A: Quick Setup (Recommended)
```bash
npm run setup:quick
```

This will:
- Create the database if it doesn't exist
- Set up the database schema
- Seed with sample data
- Create admin user

#### Option B: Manual Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

### Step 5: Start the Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## 🎯 Testing Your Setup

### 1. Test Public Pages
- Visit http://localhost:3000
- Browse museums
- Try making a reservation
- Check the confirmation page

### 2. Test Admin Panel
- Go to http://localhost:3000/admin/login
- Login with:
  - **Username**: `admin`
  - **Password**: `admin123`
- Test all admin functions

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push database schema
npm run db:seed         # Seed database with sample data
npm run db:clean        # Clean database (removes all data)
npm run db:studio       # Open Prisma Studio (database GUI)

# Setup
npm run setup:quick     # Quick setup (recommended)
npm run setup:env       # Set up environment variables
```

## 🗄️ Database Options

### Option 1: Local MySQL
If you have MySQL installed locally:
1. Start MySQL service
2. Create database: `CREATE DATABASE museum_reservation;`
3. Use: `DATABASE_URL="mysql://root:password@localhost:3306/museum_reservation"`

### Option 2: Shared Remote Database
If your team uses a shared database:
1. Get connection details from team lead
2. Use the provided connection string in `.env`

### Option 3: Cloud Database (Free)
For a quick cloud database:
1. Go to [PlanetScale](https://planetscale.com) (free tier)
2. Create new database
3. Copy connection string to `.env`

## 🐛 Troubleshooting

### Common Issues:

#### 1. "Database connection failed"
```bash
# Check if MySQL is running
# Windows: Check Services
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql

# Test connection
mysql -u root -p
```

#### 2. "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. "Prisma client not generated"
```bash
npm run db:generate
```

#### 4. "Port 3000 already in use"
```bash
# Kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

#### 5. "Environment variables not loaded"
```bash
# Make sure .env file exists and has correct format
cp env.example .env
# Edit .env with your settings
```

## 📱 Features to Test

### Public Features:
- ✅ Museum browsing
- ✅ Reservation system
- ✅ QR code generation
- ✅ Mobile responsiveness
- ✅ Confirmation page

### Admin Features:
- ✅ Dashboard overview
- ✅ Reservation management
- ✅ Visitor management
- ✅ QR scanner
- ✅ Reports & analytics
- ✅ Mobile admin panel

## 🔄 Daily Workflow

### Starting Work:
```bash
git pull origin main
npm install  # (if package.json changed)
npm run dev
```

### Before Committing:
```bash
npm run lint  # Check for errors
git add .
git commit -m "Your commit message"
git push origin main
```

## 📞 Getting Help

If you encounter issues:
1. Check this guide first
2. Ask team members
3. Check the main README.md
4. Look at error messages in terminal

## 🎉 You're Ready!

Once you see "Ready - started server on 0.0.0.0:3000", you're all set!

Visit http://localhost:3000 to see your museum reservation system in action.

---

**Happy coding! 🚀**
