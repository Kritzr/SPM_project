# Quick Start Guide

This guide will help you get the integrated project up and running quickly.

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
npm run install:all
```

### Step 2: Configure Environment

Create these three files:

**`backend/.env`**:
```env
PORT=8080
DATABASE_URL="postgresql://username:password@localhost:5432/spm_meeting?schema=public"
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**`signaling-server/.env`**:
```env
PORT=5000
CLIENT_URL=http://localhost:3000
```

**`client/.env`**:
```env
REACT_APP_SERVER_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:8080/api
```

### Step 3: Setup Database

```bash
cd backend
npx prisma generate
npx prisma migrate dev
cd ..
```

### Step 4: Start All Services

```bash
npm run dev
```

This will start:
- ✅ Backend API on http://localhost:8080
- ✅ Signaling Server on http://localhost:5000
- ✅ React Client on http://localhost:3000

### Step 5: Access the Application

Open your browser and go to:
**http://localhost:3000**

## 📝 What's Next?

1. **Register a user** at http://localhost:3000
2. **Create a meeting**
3. **Share the meeting link** with others
4. **Start video conferencing!**

## 🛠️ Troubleshooting

### Database Connection Failed?

Make sure PostgreSQL is running:
```bash
# Windows
net start postgresql-x64-14

# Or check if it's running
psql --version
```

### Port Already in Use?

Update the PORT in the respective `.env` file.

### Can't Connect to Server?

Check that all three services are running. You should see:
- "Server running on port 8080" (Backend)
- "Server running on port 5000" (Signaling)
- "Compiled successfully" (React Client)

## 🎯 Running Services Individually

If you prefer to run services in separate terminals:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Signaling Server
npm run dev:signaling

# Terminal 3 - React Client
npm run dev:client
```

## 📚 Next Steps

- Read [SETUP.md](SETUP.md) for detailed configuration
- Read [README.md](README.md) for complete documentation
- Explore the API endpoints at http://localhost:8080/api

## 💡 Tips

- Use different browsers for testing multiple users
- Allow camera/microphone permissions when prompted
- Use Chrome or Edge for best WebRTC support
- Check browser console for debugging information

---

**Happy Coding! 🎉**

