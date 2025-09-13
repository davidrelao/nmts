# MySQL Setup Guide

## 🚨 Current Issue
The database setup is failing because MySQL is not installed on your system.

## 📥 Install MySQL

### Option 1: Install via Homebrew (Recommended for macOS)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure MySQL installation
mysql_secure_installation
```

### Option 2: Download MySQL Installer
1. Go to https://dev.mysql.com/downloads/mysql/
2. Download MySQL Community Server for macOS
3. Run the installer and follow the setup wizard
4. Remember the root password you set during installation

### Option 3: Use MySQL via Docker
```bash
# Install Docker Desktop first, then run:
docker run --name mysql-museum -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=museum_reservation -p 3306:3306 -d mysql:8.0
```

## 🔧 After MySQL Installation

### 1. Verify MySQL is Running
```bash
# Check if MySQL is running
brew services list | grep mysql
# or
mysql -u root -p
```

### 2. Create the Database
```bash
# Connect to MySQL
mysql -u root -p

# Create the database
CREATE DATABASE museum_reservation;

# Exit MySQL
exit;
```

### 3. Update Environment Variables
Edit the `.env` file in your project root and update the DATABASE_URL:
```env
# Update this line with your actual MySQL credentials
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/museum_reservation"
```

### 4. Run Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

## 🐳 Alternative: Use Docker (No Installation Required)

If you prefer not to install MySQL directly, you can use Docker:

### 1. Install Docker Desktop
- Download from https://www.docker.com/products/docker-desktop/
- Install and start Docker Desktop

### 2. Run MySQL Container
```bash
# Start MySQL container
docker run --name mysql-museum \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=museum_reservation \
  -p 3306:3306 \
  -d mysql:8.0

# Verify container is running
docker ps
```

### 3. Update .env File
```env
DATABASE_URL="mysql://root:password@localhost:3306/museum_reservation"
```

### 4. Run Database Setup
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## 🔍 Troubleshooting

### MySQL Connection Issues
```bash
# Check if MySQL is running
brew services list | grep mysql

# Start MySQL if not running
brew services start mysql

# Check MySQL port
lsof -i :3306
```

### Permission Issues
```bash
# Reset MySQL root password if needed
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
```

### Docker Issues
```bash
# Stop and remove container
docker stop mysql-museum
docker rm mysql-museum

# Start fresh
docker run --name mysql-museum -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=museum_reservation -p 3306:3306 -d mysql:8.0
```

## ✅ Success Indicators

After successful setup, you should see:
- MySQL running on port 3306
- Database `museum_reservation` created
- Prisma schema pushed successfully
- Sample museum data seeded

## 🚀 Next Steps

Once MySQL is set up and running:
1. Run `npm run db:push` to create tables
2. Run `npm run db:seed` to add sample data
3. Run `npm run dev` to start the application
4. Visit `http://localhost:3000` to see the museum reservation system
5. Visit `http://localhost:3000/admin` to access the admin panel
