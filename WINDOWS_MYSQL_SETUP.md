# 🪟 Windows MySQL Setup Guide

Complete guide to install and configure MySQL on Windows for the Museum Reservation System.

## 📋 Prerequisites

- Windows 10/11
- Administrator privileges
- Internet connection

## 🚀 Method 1: MySQL Installer (Recommended)

### Step 1: Download MySQL Installer

1. Go to [MySQL Downloads](https://dev.mysql.com/downloads/installer/)
2. Download **MySQL Installer for Windows** (the larger file, ~400MB)
3. Choose the **mysql-installer-community-8.0.x.x.msi** file

### Step 2: Install MySQL

1. **Run the installer as Administrator**
2. **Choose Setup Type**: Select "Developer Default" (includes MySQL Server, Workbench, etc.)
3. **Check Requirements**: Click "Execute" to install any missing requirements
4. **Installation**: Click "Execute" to install MySQL components
5. **Configuration**: 
   - **Config Type**: Development Computer
   - **Connectivity**: 
     - Port: `3306` (default)
     - Open Windows Firewall ports: ✅ **Check this**
   - **Authentication Method**: Use Strong Password Encryption
   - **Accounts and Roles**:
     - **Root Password**: Create a strong password (remember this!)
     - **MySQL User Accounts**: Leave default
   - **Windows Service**:
     - **Configure MySQL Server as a Windows Service**: ✅ **Check this**
     - **Service Name**: MySQL80 (default)
     - **Start the MySQL Server at System Startup**: ✅ **Check this**
     - **Run Windows Service as**: Standard System Account
6. **Apply Configuration**: Click "Execute"
7. **Complete**: Click "Finish"

### Step 3: Add MySQL to PATH

1. **Open System Properties**:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Or: Right-click "This PC" → Properties → Advanced System Settings

2. **Environment Variables**:
   - Click "Environment Variables..."
   - Under "System Variables", find and select "Path"
   - Click "Edit..."

3. **Add MySQL to PATH**:
   - Click "New"
   - Add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
   - Click "OK" on all dialogs

4. **Restart Command Prompt**:
   - Close any open Command Prompt windows
   - Open a new Command Prompt

### Step 4: Verify Installation

Open Command Prompt and test:

```cmd
mysql --version
```

You should see something like:
```
mysql  Ver 8.0.35 for Win64 on x86_64 (MySQL Community Server - GPL)
```

## 🚀 Method 2: XAMPP (Alternative - Easier)

### Step 1: Download XAMPP

1. Go to [XAMPP Downloads](https://www.apachefriends.org/download.html)
2. Download XAMPP for Windows (PHP 8.2+ version)
3. Run the installer

### Step 2: Install XAMPP

1. **Run installer as Administrator**
2. **Select Components**: Make sure "MySQL" is checked
3. **Installation Directory**: Use default `C:\xampp`
4. **Complete Installation**

### Step 3: Start MySQL

1. **Open XAMPP Control Panel**
2. **Start MySQL**: Click "Start" next to MySQL
3. **Verify**: Status should show "Running"

### Step 4: Add to PATH (Optional)

Add to your PATH:
```
C:\xampp\mysql\bin
```

## 🔧 Configure MySQL for Museum Reservation System

### Step 1: Access MySQL

**Method 1: Command Line**
```cmd
mysql -u root -p
```

**Method 2: XAMPP**
- Open XAMPP Control Panel
- Click "Admin" next to MySQL (opens phpMyAdmin)

### Step 2: Create Database

```sql
CREATE DATABASE museum_reservation;
SHOW DATABASES;
```

### Step 3: Create User (Optional but Recommended)

```sql
CREATE USER 'museum_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON museum_reservation.* TO 'museum_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 4: Test Connection

```sql
USE museum_reservation;
SHOW TABLES;
```

## ⚙️ Configure Environment Variables

### Step 1: Create .env File

In your project directory, create `.env` file:

```env
# For root user
DATABASE_URL="mysql://root:your_root_password@localhost:3306/museum_reservation"

# OR for custom user
DATABASE_URL="mysql://museum_user:your_password@localhost:3306/museum_reservation"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
JWT_SECRET="your-jwt-secret-here"
```

### Step 2: Test Database Connection

```cmd
cd your-project-directory
npm run db:push
```

## 🐛 Troubleshooting

### Problem 1: "mysql is not recognized"

**Solution:**
1. Check if MySQL is in PATH:
   ```cmd
   echo %PATH%
   ```
2. If not found, add MySQL to PATH (see Step 3 above)
3. Restart Command Prompt

### Problem 2: "Access denied for user 'root'"

**Solution:**
1. Reset root password:
   ```cmd
   mysqld --init-file=C:\\mysql-init.txt
   ```
2. Create `mysql-init.txt` with:
   ```
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   ```

### Problem 3: "Can't connect to MySQL server"

**Solutions:**
1. **Check if MySQL is running**:
   - **Services**: Press `Win + R`, type `services.msc`, find "MySQL80"
   - **XAMPP**: Check XAMPP Control Panel

2. **Start MySQL Service**:
   ```cmd
   net start MySQL80
   ```

3. **Check port 3306**:
   ```cmd
   netstat -an | findstr 3306
   ```

### Problem 4: "Port 3306 already in use"

**Solution:**
1. Find what's using port 3306:
   ```cmd
   netstat -ano | findstr :3306
   ```
2. Kill the process:
   ```cmd
   taskkill /PID <PID_NUMBER> /F
   ```

### Problem 5: "Prisma connection failed"

**Solutions:**
1. **Check .env file**:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/museum_reservation"
   ```

2. **Test connection manually**:
   ```cmd
   mysql -u root -p -h localhost -P 3306
   ```

3. **Check database exists**:
   ```sql
   SHOW DATABASES;
   ```

## 🔧 Windows-Specific Commands

### Start/Stop MySQL Service

```cmd
# Start MySQL
net start MySQL80

# Stop MySQL
net stop MySQL80

# Restart MySQL
net stop MySQL80 && net start MySQL80
```

### Check MySQL Status

```cmd
# Check if MySQL is running
sc query MySQL80

# Check MySQL processes
tasklist | findstr mysql
```

### Reset MySQL Password

1. **Stop MySQL**:
   ```cmd
   net stop MySQL80
   ```

2. **Create password reset file** (`mysql-init.txt`):
   ```
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   ```

3. **Start MySQL with init file**:
   ```cmd
   mysqld --init-file=C:\\mysql-init.txt
   ```

4. **Start MySQL normally**:
   ```cmd
   net start MySQL80
   ```

## 🎯 Quick Setup Script for Windows

Create `setup-mysql-windows.bat`:

```batch
@echo off
echo Setting up MySQL for Museum Reservation System...

echo Starting MySQL service...
net start MySQL80

echo Creating database...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS museum_reservation;"

echo Database setup complete!
echo You can now run: npm run setup:team
pause
```

## ✅ Verification Checklist

- [ ] MySQL installed successfully
- [ ] MySQL service is running
- [ ] `mysql --version` works in Command Prompt
- [ ] Can connect to MySQL: `mysql -u root -p`
- [ ] Database `museum_reservation` created
- [ ] `.env` file configured correctly
- [ ] `npm run db:push` works
- [ ] `npm run dev` starts successfully

## 🚀 Next Steps

After MySQL is set up:

1. **Run team setup**:
   ```cmd
   npm run setup:team
   ```

2. **Start development**:
   ```cmd
   npm run dev
   ```

3. **Test the system**:
   - Visit: http://localhost:3000
   - Admin: http://localhost:3000/admin/login

## 📞 Getting Help

If you encounter issues:

1. **Check Windows Event Viewer** for MySQL errors
2. **Check MySQL error logs** in `C:\ProgramData\MySQL\MySQL Server 8.0\Data\`
3. **Verify firewall settings** allow port 3306
4. **Check antivirus software** isn't blocking MySQL

---

**🎉 MySQL is now ready for the Museum Reservation System!**

