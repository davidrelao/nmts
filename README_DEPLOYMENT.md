# 🏛️ Museum Reservation System - Production Deployment

A complete museum ticketing and reservation system built with Next.js, featuring QR code generation, admin dashboard, and mobile-responsive design.

## 🌟 Features

### Public Features
- **Museum Browsing**: Browse available museums and exhibitions
- **Ticket Reservation**: Easy reservation system with visitor information
- **QR Code Generation**: Unique QR codes for each reservation
- **Mobile Responsive**: Perfect experience on all devices
- **Confirmation System**: Email-style confirmation with downloadable tickets

### Admin Features
- **Dashboard**: Real-time analytics and overview
- **Reservation Management**: View, filter, and manage all reservations
- **Visitor Management**: Track visitor information and history
- **QR Scanner**: Mobile-friendly QR code scanner for check-ins
- **Reports & Analytics**: Comprehensive reporting system
- **Mobile Admin Panel**: Full admin functionality on mobile devices

## 🚀 Quick Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/museum-reservation)

### Option 2: Manual Deploy

1. **Fork this repository**
2. **Set up database** (PlanetScale or Railway)
3. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel --prod
   ```
4. **Configure environment variables**
5. **Run database setup**:
   ```bash
   npm run setup:production
   ```

## 📋 Prerequisites

- Node.js 18+ 
- MySQL database (PlanetScale/Railway)
- Vercel account (free tier available)

## 🗄️ Database Setup

### PlanetScale (Recommended)
1. Create account at [PlanetScale](https://planetscale.com)
2. Create new database: `museum_reservation`
3. Copy connection string
4. Format: `mysql://username:password@host:port/database_name`

### Railway (Alternative)
1. Create account at [Railway](https://railway.app)
2. Create MySQL database
3. Copy connection string

## ⚙️ Environment Variables

Set these in your Vercel dashboard:

```env
DATABASE_URL=mysql://username:password@host:port/database_name
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secure-secret-key-here
JWT_SECRET=your-super-secure-jwt-secret-here
```

## 🎯 Default Admin Access

**Username**: `admin`  
**Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials in production!

## 📱 Mobile Features

- **Responsive Design**: Works perfectly on phones, tablets, and desktops
- **Touch-Friendly**: All buttons and interactions optimized for mobile
- **QR Scanner**: Mobile-optimized QR code scanner for staff
- **Admin Panel**: Full admin functionality on mobile devices
- **No Horizontal Scrolling**: All content fits perfectly on mobile screens

## 🔧 Development

### Local Setup
```bash
# Clone repository
git clone https://github.com/your-username/museum-reservation.git
cd museum-reservation

# Install dependencies
npm install

# Set up environment
cp env.example .env
# Edit .env with your database URL

# Set up database
npm run setup:quick

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:seed      # Seed database with sample data
npm run setup:production  # Set up production database
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL (PlanetScale/Railway)
- **Authentication**: Client-side localStorage
- **QR Codes**: qrcode library
- **Icons**: Lucide React
- **Deployment**: Vercel

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── museums/           # Museum browsing
│   ├── reserve/           # Reservation flow
│   └── confirmation/      # Confirmation page
├── components/            # Reusable components
├── lib/                   # Database and utilities
└── hooks/                 # Custom React hooks
```

## 🔒 Security Features

- **Input Validation**: All forms validated
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection
- **Environment Variables**: Sensitive data in environment variables
- **HTTPS**: Automatic HTTPS on Vercel

## 📊 Analytics & Monitoring

### Built-in Analytics
- **Reservation Tracking**: Real-time reservation counts
- **Visitor Analytics**: Visitor statistics and trends
- **Check-in Rates**: Monitor attendance rates
- **Section Popularity**: Track popular museum sections

### Vercel Analytics
- **Performance Monitoring**: Page load times
- **Error Tracking**: Automatic error reporting
- **Usage Analytics**: Visitor behavior insights

## 🎨 Customization

### Branding
- **Colors**: Update Tailwind config for your brand colors
- **Logo**: Replace favicon and museum images
- **Content**: Update museum information in database

### Features
- **Email Notifications**: Add email service (SendGrid, Resend)
- **Payment Integration**: Add Stripe or PayPal
- **Multi-language**: Add internationalization
- **Advanced Analytics**: Integrate Google Analytics

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Verify firewall settings

2. **Build Errors**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

3. **Environment Variables**
   - Ensure all variables are set in Vercel
   - Check variable names match exactly
   - Redeploy after adding variables

### Getting Help
1. Check Vercel function logs
2. Verify database connection
3. Test locally first
4. Check environment variables

## 🔄 Updates & Maintenance

### Regular Tasks
- **Database Backups**: Set up automatic backups
- **Security Updates**: Keep dependencies updated
- **Performance Monitoring**: Monitor Vercel analytics
- **User Feedback**: Collect and implement improvements

### Scaling
- **Database**: Upgrade to higher tier as needed
- **CDN**: Vercel provides global CDN
- **Caching**: Implement Redis for session storage
- **Load Balancing**: Vercel handles automatically

## 📈 Future Enhancements

### Planned Features
- **Email Notifications**: Reservation confirmations
- **Payment Integration**: Online payment processing
- **Mobile App**: React Native mobile app
- **Advanced Analytics**: Detailed reporting
- **Multi-language Support**: Internationalization
- **API Documentation**: Public API for integrations

### Integration Options
- **Calendar Systems**: Google Calendar integration
- **CRM Systems**: Salesforce, HubSpot integration
- **Marketing Tools**: Mailchimp, SendGrid integration
- **Analytics**: Google Analytics, Mixpanel integration

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section
- Review the deployment guide

---

**🎉 Your Museum Reservation System is ready for production!**

Deploy now and start managing museum reservations with ease.
