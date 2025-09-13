# Museum Reservation System - Setup & Run Guide

This guide will help you set up and run both the **Client Side** (public reservation system) and **Admin Panel** (back office management) platforms.

## 🏗️ System Architecture

### Client Side (Public)
- **Purpose**: Public-facing ticket reservation system
- **Features**: 
  - Museum browsing and information
  - Ticket reservation with visitor data collection
  - QR code generation for each reservation
  - Ticket download functionality

### Admin Panel (Back Office)
- **Purpose**: Museum staff management dashboard
- **Features**:
  - Real-time attendance tracking
  - QR code scanner for mobile devices
  - Real-time ticket validation
  - Today's reservations list
  - Check-in management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MySQL database running
- Git (for cloning the repository)

### 1. Database Setup

#### Option A: Clean Slate (Recommended)
```bash
# Clean the database completely
npm run db:clean

# Push the schema to create fresh tables
npm run db:push

# Seed with initial data
npm run db:seed
```

#### Option B: Fresh Database
```bash
# Create a new MySQL database
mysql -u root -p
CREATE DATABASE museum_reservation;
exit

# Update your .env.local file with the database URL
# DATABASE_URL="mysql://username:password@localhost:3306/museum_reservation"

# Push schema and seed
npm run db:push
npm run db:seed
```

### 2. Environment Configuration

Create `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="mysql://root:password@localhost:3306/museum_reservation"

# NextAuth (for future authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# JWT (for future features)
JWT_SECRET="your-jwt-secret-here"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Application
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## 📱 How to Run Both Platforms

### Client Side (Public Reservation System)
1. **Access**: Navigate to `http://localhost:3000`
2. **Features Available**:
   - Browse museums and sections
   - Reserve tickets with visitor information
   - Generate and download QR code tickets
   - View confirmation pages

### Admin Panel (Back Office)
1. **Access**: Navigate to `http://localhost:3000/admin`
2. **Features Available**:
   - View real-time attendance statistics
   - Scan QR codes for check-in validation
   - Manage today's reservations
   - Track visitor check-ins

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database Management
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
npm run db:clean     # Clean database (remove all data)
```

## 📊 Database Schema

### Museums Table
- `id` - Unique identifier
- `name` - Museum name
- `description` - Museum description
- `location` - Museum location
- `opening_hours` - Operating hours
- `admission_price` - Ticket price
- `image_url` - Museum image
- `created_at` - Creation timestamp

### Reservations Table
- `id` - Unique identifier
- `visitor_name` - Visitor's full name
- `visitor_email` - Visitor's email
- `reservation_code` - Unique reservation code
- `qr_code_data` - Base64 QR code image
- `visit_date` - Scheduled visit date
- `visit_time` - Scheduled visit time
- `museum_section` - Selected museum section
- `number_of_visitors` - Number of people
- `checked_in` - Check-in status (admin feature)
- `checked_in_at` - Check-in timestamp (admin feature)
- `museum_id` - Foreign key to museum
- `created_at` - Creation timestamp

## 🎯 Core Features Implementation

### ✅ Client Side Requirements
- [x] **Public-facing ticket reservation page** - `/museums` and `/reserve/[museumId]`
- [x] **Visitor data collection** - Name and email collection
- [x] **Database storage** - MySQL with Prisma ORM
- [x] **Unique QR code generation** - Generated for each reservation
- [x] **Ticket download** - Full ticket with QR code

### ✅ Admin Panel Requirements
- [x] **Administrative dashboard** - `/admin` with real-time stats
- [x] **QR code scanner** - Mobile-friendly scanner component
- [x] **Real-time ticket validation** - Check-in system
- [x] **Attendance tracking** - Real-time counts and lists
- [x] **Today's reservations** - Filtered view for current day

## 🔍 Testing the System

### Test Client Side Flow
1. Go to `http://localhost:3000`
2. Click "Explore Museums"
3. Select a museum section
4. Fill out the reservation form
5. Complete the reservation
6. Download the ticket

### Test Admin Panel Flow
1. Go to `http://localhost:3000/admin`
2. View the dashboard statistics
3. Click "Scan QR Code"
4. Use the scanner to validate tickets
5. Check in visitors
6. Monitor real-time updates

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Check if MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Check Prisma connection
npm run db:studio
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📱 Mobile QR Scanner

The admin panel includes a mobile-friendly QR scanner that:
- Uses device camera for scanning
- Validates QR codes in real-time
- Provides immediate feedback
- Works on both desktop and mobile devices

## 🔄 Real-time Features

The system provides real-time updates for:
- Attendance counts
- Check-in status
- Reservation lists
- Dashboard statistics

## 🚀 Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms
- Railway: Full-stack deployment
- DigitalOcean: App Platform
- AWS: Amplify or EC2

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Verify database connection
3. Ensure all dependencies are installed
4. Check environment variables

## 🎉 Success!

Once everything is running, you'll have:
- ✅ A fully functional museum reservation system
- ✅ An admin panel for staff management
- ✅ Real-time QR code validation
- ✅ Complete visitor tracking
- ✅ Mobile-friendly interfaces

Both platforms are now ready for testing and production use!
