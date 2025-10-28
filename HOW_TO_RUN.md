# How to Run the Project - Step by Step

## 📍 Current Situation

You have **OLD folders** and **NEW folders**:

**OLD (can delete later):**
- `Backend code/` 
- `front_end/client/`
- `front_end/server/`

**NEW (use these):**
- `backend/` ← Use this
- `client/` ← Use this  
- `signaling-server/` ← Use this

---

## 🚀 Step-by-Step to Run the Project

### Step 1: Install All Dependencies

Open PowerShell in the project root and run:

```powershell
# Install root dependencies
npm install

# Install dependencies for all services
npm run install:all
```

### Step 2: Create Environment Files

You need to create `.env` files for each service. Here's what to do:

**Create `backend/.env`:**
```bash
# Copy the example file
Copy-Item "backend\env.example" "backend\.env"

# Then edit backend/.env with your database details
```

**Create `signaling-server/.env`:**
```bash
Copy-Item "signaling-server\env.example" "signaling-server\.env"
```

**Create `client/.env`:**
```bash
Copy-Item "client\env.example" "client\.env"
```

### Step 3: Configure Database

Edit `backend/.env` and set your database:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
JWT_SECRET=your-secret-key-here
PORT=8080
CLIENT_URL=http://localhost:3000
```

Then run:
```bash
npm run prisma:generate
npm run prisma:migrate
```

### Step 4: Start All Services

```bash
npm run dev
```

This will start:
- ✅ Backend API on http://localhost:8080
- ✅ Signaling Server on http://localhost:5000
- ✅ React Client on http://localhost:3000

### Step 5: Open the Application

Open your browser and go to: **http://localhost:3000**

---

## 🎯 Quick Commands Reference

```bash
# Start everything
npm run dev

# Start services individually
npm run dev:backend      # Backend only
npm run dev:signaling    # Signaling only
npm run dev:client       # Client only

# Database
npm run prisma:generate
npm run prisma:migrate
```

---

## 🗑️ Clean Up Old Folders (After Testing)

Once you verify everything works, you can delete the old folders:

```powershell
# Delete old folders
Remove-Item -Recurse -Force "Backend code"
Remove-Item -Recurse -Force "front_end"
```

---

## ⚠️ Troubleshooting

### Port Already in Use?
Change the port in the `.env` file of the respective service.

### Database Connection Failed?
Make sure PostgreSQL is running and DATABASE_URL is correct in `backend/.env`

### Module Import Errors?
Make sure all dependencies are installed: `npm run install:all`

---

## 📞 Need Help?

Check the detailed guides:
- [QUICK_START.md](QUICK_START.md)
- [SETUP.md](SETUP.md)
- [README.md](README.md)

