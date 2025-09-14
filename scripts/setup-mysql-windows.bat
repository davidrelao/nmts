@echo off
echo.
echo ========================================
echo  Museum Reservation System - MySQL Setup
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running as Administrator - Good!
) else (
    echo WARNING: Not running as Administrator
    echo Some operations may fail. Consider running as Administrator.
    echo.
)

echo Checking MySQL installation...

REM Check if MySQL is installed
mysql --version >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ MySQL is installed and accessible
    mysql --version
) else (
    echo ❌ MySQL not found in PATH
    echo.
    echo Please install MySQL first:
    echo 1. Download from: https://dev.mysql.com/downloads/installer/
    echo 2. Install MySQL Server
    echo 3. Add MySQL to PATH: C:\Program Files\MySQL\MySQL Server 8.0\bin
    echo 4. Restart Command Prompt
    echo.
    echo See WINDOWS_MYSQL_SETUP.md for detailed instructions
    pause
    exit /b 1
)

echo.
echo Starting MySQL service...
net start MySQL80 >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ MySQL service started successfully
) else (
    echo ⚠️  MySQL service may already be running or failed to start
    echo Checking service status...
    sc query MySQL80 | findstr "RUNNING" >nul
    if %errorLevel% == 0 (
        echo ✅ MySQL service is running
    ) else (
        echo ❌ MySQL service is not running
        echo Please start MySQL service manually or check installation
        pause
        exit /b 1
    )
)

echo.
echo Testing MySQL connection...
mysql -u root -e "SELECT 1;" >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ MySQL connection successful (no password required)
    set MYSQL_AUTH=-u root
) else (
    echo MySQL requires password authentication
    set /p MYSQL_PASSWORD="Enter MySQL root password: "
    mysql -u root -p%MYSQL_PASSWORD% -e "SELECT 1;" >nul 2>&1
    if %errorLevel% == 0 (
        echo ✅ MySQL connection successful
        set MYSQL_AUTH=-u root -p%MYSQL_PASSWORD%
    ) else (
        echo ❌ MySQL connection failed
        echo Please check your password and try again
        pause
        exit /b 1
    )
)

echo.
echo Creating database...
mysql %MYSQL_AUTH% -e "CREATE DATABASE IF NOT EXISTS museum_reservation;" 2>nul
if %errorLevel% == 0 (
    echo ✅ Database 'museum_reservation' created successfully
) else (
    echo ❌ Failed to create database
    echo Please check MySQL permissions
    pause
    exit /b 1
)

echo.
echo Verifying database...
mysql %MYSQL_AUTH% -e "USE museum_reservation; SHOW TABLES;" >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Database is accessible
) else (
    echo ❌ Database access failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo  MySQL Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update your .env file with database connection:
echo    DATABASE_URL="mysql://root:password@localhost:3306/museum_reservation"
echo.
echo 2. Run the project setup:
echo    npm run setup:team
echo.
echo 3. Start development:
echo    npm run dev
echo.
echo 4. Visit: http://localhost:3000
echo.

REM Create sample .env if it doesn't exist
if not exist ".env" (
    echo Creating sample .env file...
    copy "env.example" ".env" >nul 2>&1
    if %errorLevel% == 0 (
        echo ✅ Created .env file from env.example
        echo ⚠️  Please edit .env with your database password
    )
)

echo Press any key to continue...
pause >nul

