# Museum Reservation System - Next.js with MySQL

A modern museum reservation platform built with Next.js 14, TypeScript, Tailwind CSS, and MySQL database.

## Features

- 🏛️ Museum browsing and information
- 🎫 Digital ticket reservation system
- 📱 QR code generation for tickets
- 📥 Ticket download functionality
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔒 Type-safe API routes with TypeScript
- 🗄️ MySQL database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL with Prisma ORM
- **QR Codes**: qrcode library
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ 
- MySQL database
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a MySQL database named `museum_reservation`
2. Copy `.env.example` to `.env.local` and update the database URL:

```env
DATABASE_URL="mysql://username:password@localhost:3306/museum_reservation"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
JWT_SECRET="your-jwt-secret-here"
```

### 3. Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with initial data
npm run db:seed
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

### Museums Table
- `id` (String, Primary Key)
- `name` (String)
- `description` (String, Optional)
- `location` (String)
- `opening_hours` (String)
- `admission_price` (String, Optional)
- `image_url` (String, Optional)
- `created_at` (DateTime)

### Reservations Table
- `id` (String, Primary Key)
- `visitor_name` (String)
- `visitor_email` (String)
- `reservation_code` (String, Unique)
- `qr_code_data` (String)
- `visit_date` (DateTime)
- `visit_time` (String)
- `museum_section` (String)
- `number_of_visitors` (Integer)
- `museum_id` (String, Foreign Key)
- `created_at` (DateTime)

## API Routes

- `GET /api/museums` - Get all museums
- `GET /api/museums?id={id}` - Get specific museum
- `POST /api/museums` - Create new museum
- `GET /api/reservations` - Get all reservations
- `GET /api/reservations?code={code}` - Get specific reservation
- `POST /api/reservations` - Create new reservation

## Project Structure

```
src/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── museums/           # Museums page
│   ├── reserve/           # Reservation pages
│   ├── confirmation/      # Confirmation page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions
│   ├── db.ts             # Prisma client
│   └── seed.ts           # Database seeding
└── assets/               # Static assets
```

## Migration from React/Vite

This project has been migrated from a React/Vite + Supabase setup to Next.js + MySQL:

### Key Changes:
- ✅ Replaced Vite with Next.js 14
- ✅ Migrated from Supabase to MySQL with Prisma
- ✅ Converted React Router to Next.js App Router
- ✅ Replaced Supabase client with custom API routes
- ✅ Updated styling to work with Next.js
- ✅ Added TypeScript support throughout
- ✅ Implemented server-side rendering

### Removed Dependencies:
- `@supabase/supabase-js`
- `react-router-dom`
- `vite`

### Added Dependencies:
- `next`
- `@prisma/client`
- `mysql2`
- `prisma`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
