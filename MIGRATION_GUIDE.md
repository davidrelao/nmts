# Migration Guide: React/Vite + Supabase → Next.js + MySQL

This guide documents the complete migration from the original React/Vite + Supabase setup to the new Next.js + MySQL architecture.

## Overview of Changes

### Architecture Changes
- **Frontend**: React with Vite → Next.js 14 with App Router
- **Backend**: Supabase (PostgreSQL) → Custom API routes with MySQL
- **Database**: PostgreSQL → MySQL with Prisma ORM
- **Routing**: React Router → Next.js App Router
- **Styling**: Tailwind CSS (maintained)

### Key Benefits of Migration
1. **Full-stack Framework**: Next.js provides both frontend and backend in one framework
2. **Better Performance**: Server-side rendering and static generation
3. **Type Safety**: End-to-end TypeScript support
4. **Database Control**: Direct MySQL access with Prisma ORM
5. **Deployment**: Easier deployment with Vercel or other platforms

## Detailed Migration Steps

### 1. Project Structure Changes

#### Before (React/Vite)
```
src/
├── components/
├── pages/
├── hooks/
├── integrations/supabase/
└── main.jsx
```

#### After (Next.js)
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── museums/
│   ├── reserve/
│   ├── confirmation/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/                   # Database and utilities
└── assets/
```

### 2. Database Migration

#### Supabase Schema (PostgreSQL)
```sql
-- Museums table
CREATE TABLE museums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  opening_hours TEXT NOT NULL,
  admission_price TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations table
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  reservation_code TEXT NOT NULL UNIQUE,
  qr_code_data TEXT NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TEXT NOT NULL,
  museum_section TEXT NOT NULL,
  museum_id UUID REFERENCES museums(id),
  number_of_visitors INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Prisma Schema (MySQL)
```prisma
model Museum {
  id            String   @id @default(cuid())
  name          String
  description   String?
  location      String
  openingHours  String   @map("opening_hours")
  admissionPrice String? @map("admission_price")
  imageUrl      String?  @map("image_url")
  createdAt     DateTime @default(now()) @map("created_at")
  
  reservations  Reservation[]
  
  @@map("museums")
}

model Reservation {
  id                String   @id @default(cuid())
  visitorName       String   @map("visitor_name")
  visitorEmail      String   @map("visitor_email")
  reservationCode   String   @unique @map("reservation_code")
  qrCodeData        String   @map("qr_code_data")
  visitDate         DateTime @map("visit_date")
  visitTime         String   @map("visit_time")
  museumSection     String   @map("museum_section")
  numberOfVisitors  Int      @default(1) @map("number_of_visitors")
  createdAt         DateTime @default(now()) @map("created_at")
  
  museumId          String   @map("museum_id")
  museum            Museum   @relation(fields: [museumId], references: [id])
  
  @@map("reservations")
}
```

### 3. Component Migration

#### Before: React Router Navigation
```jsx
import { Link, useNavigate } from 'react-router-dom'

const navigate = useNavigate()
<Link to="/museums">Museums</Link>
navigate('/confirmation')
```

#### After: Next.js Navigation
```jsx
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const router = useRouter()
<Link href="/museums">Museums</Link>
router.push('/confirmation')
```

### 4. Data Fetching Migration

#### Before: Supabase Client
```jsx
import { supabase } from '../integrations/supabase/client'

const { data, error } = await supabase
  .from('museums')
  .select('*')
  .single()
```

#### After: API Routes
```jsx
// Server Component (recommended)
const museum = await prisma.museum.findFirst()

// Client Component
const response = await fetch('/api/museums')
const museums = await response.json()
```

### 5. API Routes Implementation

#### Museums API (`/api/museums`)
```typescript
export async function GET(request: NextRequest) {
  const museums = await prisma.museum.findMany()
  return NextResponse.json(museums)
}
```

#### Reservations API (`/api/reservations`)
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  const reservation = await prisma.reservation.create({
    data: body,
    include: { museum: true }
  })
  return NextResponse.json(reservation)
}
```

### 6. State Management Changes

#### Before: Session Storage + Supabase
```jsx
// Store in sessionStorage
sessionStorage.setItem('reservation', JSON.stringify(data))

// Fetch from Supabase
const { data } = await supabase
  .from('reservations')
  .select('*, museums(*)')
  .eq('id', reservationId)
```

#### After: Session Storage + API Routes
```jsx
// Store in sessionStorage (same)
sessionStorage.setItem('reservation', JSON.stringify(data))

// Fetch from API
const response = await fetch(`/api/reservations?code=${code}`)
const reservation = await response.json()
```

### 7. Styling Migration

#### Tailwind Configuration Update
```javascript
// Before: Vite-specific paths
content: ['./index.html', './src/**/*.{js,jsx}']

// After: Next.js-specific paths
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
]
```

### 8. Environment Variables

#### Before: Supabase
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

#### After: MySQL + Next.js
```env
DATABASE_URL="mysql://username:password@localhost:3306/museum_reservation"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
```

## Migration Checklist

### ✅ Completed
- [x] Project structure migration to Next.js App Router
- [x] Database schema migration to MySQL with Prisma
- [x] Component migration from React Router to Next.js
- [x] API routes implementation
- [x] Styling migration (Tailwind CSS)
- [x] TypeScript integration
- [x] QR code generation functionality
- [x] File cleanup (removed old Vite/Supabase files)

### 🔄 In Progress
- [ ] Database setup and seeding
- [ ] Testing and validation

### 📋 Remaining
- [ ] Authentication system (if needed)
- [ ] Production deployment setup
- [ ] Performance optimization
- [ ] Error handling improvements

## Testing the Migration

### 1. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE museum_reservation;

# Run migrations
npm run db:push
npm run db:seed
```

### 2. Development Server
```bash
npm run dev
```

### 3. Test Functionality
- [ ] Home page loads correctly
- [ ] Museums page displays museum information
- [ ] Reservation form works
- [ ] QR code generation works
- [ ] Confirmation page displays correctly
- [ ] Ticket download works

## Performance Improvements

### Server-Side Rendering
- Museum data is now fetched server-side
- Better SEO and initial page load performance
- Reduced client-side JavaScript bundle

### Database Optimization
- Direct MySQL queries with Prisma
- Better query optimization
- Reduced API latency

### Bundle Optimization
- Next.js automatic code splitting
- Optimized asset loading
- Better caching strategies

## Deployment Considerations

### Vercel (Recommended)
- Automatic deployments from GitHub
- Built-in MySQL database support
- Edge functions for API routes

### Other Platforms
- Railway: Good for full-stack apps
- DigitalOcean: App Platform support
- AWS: Amplify or EC2 deployment

## Rollback Plan

If issues arise, you can rollback by:
1. Reverting to the previous Git commit
2. Restoring the Supabase configuration
3. Reinstalling the old dependencies

## Support and Troubleshooting

### Common Issues
1. **Database Connection**: Check MySQL credentials in `.env.local`
2. **Prisma Client**: Run `npm run db:generate` after schema changes
3. **Build Errors**: Check TypeScript types and imports
4. **API Routes**: Verify route file structure and exports

### Getting Help
- Check the Next.js documentation
- Review Prisma documentation
- Check the project's README.md
- Review the API route implementations

## Conclusion

The migration successfully transforms the museum reservation system from a client-side React app with Supabase to a full-stack Next.js application with MySQL. The new architecture provides better performance, type safety, and deployment options while maintaining all the original functionality.
