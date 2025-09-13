#!/bin/bash

# Museum Reservation System - Quick Deploy Script
# This script helps you deploy to Vercel quickly

echo "🚀 Museum Reservation System - Deployment Script"
echo "================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Museum Reservation System"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🔧 Pre-deployment checklist:"
echo "1. ✅ Database provider set up (PlanetScale/Railway)"
echo "2. ✅ Environment variables ready"
echo "3. ✅ Code committed to Git"
echo ""

read -p "Have you completed the checklist above? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please complete the checklist first. See DEPLOYMENT_GUIDE.md for details."
    exit 1
fi

echo ""
echo "🚀 Starting deployment process..."

# Build the project locally first
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Run database migration: npm run setup:production"
echo "3. Test your deployment"
echo "4. Change default admin credentials"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
