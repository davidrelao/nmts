# 🚀 Museum Reservation System - Deployment Guide

## Overview
This guide will help you deploy the Museum Reservation System to Vercel with a production database.

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Database provider account (PlanetScale or Railway)

## Step 1: Database Setup

### Option A: PlanetScale (Recommended - Free Tier)
1. Go to [PlanetScale](https://planetscale.com)
2. Create a new database called `museum_reservation`
3. Copy the connection string
4. Format: `mysql://username:password@host:port/database_name`

### Option B: Railway (Alternative)
1. Go to [Railway](https://railway.app)
2. Create a new MySQL database
3. Copy the connection string

## Step 2: Prepare Your Code

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Update package.json (if needed)
Ensure your build script is correct:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "postbuild": "prisma generate"
  }
}
```

## Step 3: Deploy to Vercel

### 1. Connect to Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### 2. Configure Environment Variables
In Vercel dashboard, go to Settings > Environment Variables and add:

```
DATABASE_URL=mysql://username:password@host:port/database_name
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secure-secret-key-here
JWT_SECRET=your-super-secure-jwt-secret-here
```

### 3. Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://your-app-name.vercel.app`

## Step 4: Database Migration

### 1. Run Prisma Migration
After deployment, you need to set up the database schema:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Run database migration
npx prisma db push --preview-feature
```

### 2. Seed the Database
```bash
# Run the seed script
npm run db:seed
```

## Step 5: Test Your Deployment

### 1. Test Public Pages
- Visit your Vercel URL
- Test museum browsing
- Test reservation flow
- Test confirmation page

### 2. Test Admin Panel
- Go to `/admin/login`
- Login with: `admin` / `admin123`
- Test all admin functions
- Test QR scanner

## Step 6: Production Optimizations

### 1. Custom Domain (Optional)
1. In Vercel dashboard, go to Domains
2. Add your custom domain
3. Update DNS settings

### 2. Analytics (Optional)
Add Google Analytics:
1. Get GA tracking ID
2. Add to environment variables:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

### 3. Email Notifications (Future Enhancement)
Consider adding email notifications for reservations using:
- SendGrid
- Resend
- Nodemailer

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure database is accessible from Vercel
   - Check firewall settings

2. **Build Errors**
   - Check Node.js version (should be 18+)
   - Ensure all dependencies are in package.json
   - Check for TypeScript errors

3. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Redeploy after adding variables

## Security Considerations

1. **Change Default Admin Credentials**
   - Update admin login in production
   - Use strong passwords
   - Consider implementing proper authentication

2. **Database Security**
   - Use connection pooling
   - Enable SSL connections
   - Regular backups

3. **API Security**
   - Rate limiting
   - Input validation
   - CORS configuration

## Monitoring

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Monitor performance
   - Track errors

2. **Database Monitoring**
   - Monitor connection usage
   - Set up alerts
   - Regular backups

## Support

If you encounter issues:
1. Check Vercel function logs
2. Check database connection
3. Verify environment variables
4. Test locally first

## Next Steps

1. **Custom Domain**: Set up your own domain
2. **Email Integration**: Add email notifications
3. **Payment Integration**: Add payment processing
4. **Analytics**: Implement detailed analytics
5. **Mobile App**: Consider React Native app

---

**Your Museum Reservation System is now live! 🎉**
