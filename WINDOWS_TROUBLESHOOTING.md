# 🪟 Windows Troubleshooting Guide

Common issues and solutions for Windows users setting up the Museum Reservation System.

## 🚨 Common Issues

### Issue 1: "mysql is not recognized as an internal or external command"

**Problem**: MySQL is not in your system PATH.

**Solutions**:

#### Solution A: Add MySQL to PATH
1. **Find MySQL installation**:
   - Usually: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
   - Or: `C:\xampp\mysql\bin` (if using XAMPP)

2. **Add to PATH**:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Environment Variables"
   - Under "System Variables", find "Path", click "Edit"
   - Click "New", add MySQL bin path
   - Click "OK" on all dialogs

3. **Restart Command Prompt**

#### Solution B: Use Full Path
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql" --version
```

#### Solution C: Use XAMPP
1. Download [XAMPP](https://www.apachefriends.org/download.html)
2. Install and start MySQL from XAMPP Control Panel
3. Use: `C:\xampp\mysql\bin\mysql`

### Issue 2: "Access denied for user 'root'@'localhost'"

**Problem**: Wrong password or MySQL not configured properly.

**Solutions**:

#### Solution A: Reset Root Password
1. **Stop MySQL**:
   ```cmd
   net stop MySQL80
   ```

2. **Create password reset file** (`mysql-init.txt`):
   ```
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
   ```

3. **Start MySQL with init file**:
   ```cmd
   mysqld --init-file=C:\\mysql-init.txt
   ```

4. **Start MySQL normally**:
   ```cmd
   net start MySQL80
   ```

#### Solution B: Use XAMPP Default
- XAMPP usually has no password for root
- Try: `mysql -u root` (no password)

#### Solution C: Check MySQL Installation
1. **Reinstall MySQL** with proper configuration
2. **Set root password** during installation
3. **Remember the password** you set

### Issue 3: "Can't connect to MySQL server on 'localhost'"

**Problem**: MySQL service is not running.

**Solutions**:

#### Solution A: Start MySQL Service
```cmd
net start MySQL80
```

#### Solution B: Check Service Status
1. Press `Win + R`, type `services.msc`
2. Find "MySQL80" or "MySQL"
3. Right-click → Start

#### Solution C: Use XAMPP
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Status should show "Running"

### Issue 4: "Port 3306 is already in use"

**Problem**: Another service is using port 3306.

**Solutions**:

#### Solution A: Find and Kill Process
```cmd
netstat -ano | findstr :3306
taskkill /PID <PID_NUMBER> /F
```

#### Solution B: Change MySQL Port
1. **Edit MySQL config** (`my.ini` or `my.cnf`)
2. **Change port** from 3306 to 3307
3. **Update .env**:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3307/museum_reservation"
   ```

#### Solution C: Use Different MySQL Instance
- Install MySQL on different port
- Or use XAMPP (usually uses 3306)

### Issue 5: "Prisma connection failed"

**Problem**: Database connection string is incorrect.

**Solutions**:

#### Solution A: Check .env File
```env
# Correct format:
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# Examples:
DATABASE_URL="mysql://root:password@localhost:3306/museum_reservation"
DATABASE_URL="mysql://root@localhost:3306/museum_reservation"  # No password
```

#### Solution B: Test Connection Manually
```cmd
mysql -u root -p -h localhost -P 3306
```

#### Solution C: Check Database Exists
```sql
SHOW DATABASES;
CREATE DATABASE IF NOT EXISTS museum_reservation;
```

### Issue 6: "Module not found" errors

**Problem**: Node modules not installed properly.

**Solutions**:

#### Solution A: Reinstall Dependencies
```cmd
rmdir /s node_modules
del package-lock.json
npm install
```

#### Solution B: Clear npm Cache
```cmd
npm cache clean --force
npm install
```

#### Solution C: Use Different Node Version
```cmd
node --version
npm --version
```

### Issue 7: "Port 3000 is already in use"

**Problem**: Another application is using port 3000.

**Solutions**:

#### Solution A: Kill Process Using Port 3000
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

#### Solution B: Use Different Port
```cmd
npm run dev -- -p 3001
```

#### Solution C: Find and Close Application
- Check if another development server is running
- Close other applications using port 3000

## 🔧 Windows-Specific Commands

### MySQL Service Management
```cmd
# Start MySQL
net start MySQL80

# Stop MySQL
net stop MySQL80

# Restart MySQL
net stop MySQL80 && net start MySQL80

# Check status
sc query MySQL80
```

### Process Management
```cmd
# Find processes using port
netstat -ano | findstr :3306
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID_NUMBER> /F

# Find MySQL processes
tasklist | findstr mysql
```

### File and Directory Operations
```cmd
# Navigate to project
cd /d C:\path\to\your\project

# Check if file exists
if exist ".env" echo .env exists

# Copy file
copy "env.example" ".env"

# List files
dir
```

## 🛠️ Diagnostic Commands

### Check System Information
```cmd
# Check Windows version
ver

# Check Node.js version
node --version

# Check npm version
npm --version

# Check MySQL version
mysql --version

# Check if MySQL is in PATH
echo %PATH%
```

### Check Network and Ports
```cmd
# Check if port 3306 is open
netstat -an | findstr 3306

# Check if port 3000 is open
netstat -an | findstr 3000

# Test MySQL connection
telnet localhost 3306
```

### Check MySQL Status
```cmd
# Check MySQL service
sc query MySQL80

# Check MySQL processes
tasklist | findstr mysql

# Check MySQL logs
type "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err"
```

## 🚀 Quick Fixes

### Complete Reset (Nuclear Option)
```cmd
# Stop all services
net stop MySQL80

# Kill all Node processes
taskkill /f /im node.exe

# Clean project
rmdir /s node_modules
del package-lock.json

# Reinstall everything
npm install
npm run setup:team
```

### XAMPP Alternative Setup
```cmd
# Download and install XAMPP
# Start MySQL from XAMPP Control Panel
# Use connection string:
DATABASE_URL="mysql://root@localhost:3306/museum_reservation"
```

## 📞 Getting Help

### Check Logs
1. **MySQL Error Logs**: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`
2. **Windows Event Viewer**: Look for MySQL errors
3. **Node.js Console**: Check terminal output

### Common Solutions
1. **Restart everything**: Computer, MySQL, Command Prompt
2. **Run as Administrator**: Right-click Command Prompt → "Run as administrator"
3. **Check antivirus**: May be blocking MySQL or Node.js
4. **Check firewall**: Allow MySQL and Node.js through Windows Firewall

### When All Else Fails
1. **Use XAMPP**: Easiest MySQL setup for Windows
2. **Use cloud database**: PlanetScale or Railway (no local setup needed)
3. **Ask team members**: They may have encountered the same issue

---

**🎯 Most Windows issues are solved by:**
1. Adding MySQL to PATH
2. Starting MySQL service
3. Using correct connection string in .env
4. Running as Administrator

**💡 Pro Tip**: XAMPP is often the easiest solution for Windows users!

