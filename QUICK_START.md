# 🚀 Quick Start - Museum Reservation System

## For Team Members

### 1. Clone and Setup (One Command)
```bash
git clone <repository-url>
cd museum-reservation
npm run setup:team
```

### 2. Edit Database Settings
Open `.env` file and update:
```env
DATABASE_URL="mysql://root:password@localhost:3306/museum_reservation"
```

### 3. Start Development
```bash
npm run dev
```

### 4. Open Browser
Visit: **http://localhost:3000**

## 🎯 Test Everything

### Public Site
- Browse museums
- Make a reservation
- Check confirmation page

### Admin Panel
- Go to: http://localhost:3000/admin/login
- Login: `admin` / `admin123`
- Test all features

## 🗄️ Database Options

### Option 1: Local MySQL

**Windows Users:**
```cmd
# Run the Windows setup script:
scripts\setup-mysql-windows.bat

# Then use:
DATABASE_URL="mysql://root:password@localhost:3306/museum_reservation"
```

**Mac/Linux Users:**
```bash
# Install MySQL, then use:
DATABASE_URL="mysql://root:password@localhost:3306/museum_reservation"
```

### Option 2: Cloud Database (Free)
- [PlanetScale](https://planetscale.com) - Free tier
- [Railway](https://railway.app) - Free tier

### Option 3: XAMPP (Windows - Easiest)
- Download [XAMPP](https://www.apachefriends.org/download.html)
- Install and start MySQL from XAMPP Control Panel

## 🔧 Common Commands

```bash
npm run dev              # Start development
npm run setup:team       # Quick setup
npm run db:seed          # Add sample data
npm run db:studio        # Database GUI
```

## 🐛 Problems?

1. **Database error** → Check MySQL is running
2. **Module not found** → Run `npm install`
3. **Port 3000 busy** → Kill process or use different port

See `TEAM_SETUP_GUIDE.md` for detailed help.

---

**That's it! You're ready to go! 🎉**
