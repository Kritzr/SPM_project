# 🚀 START HERE - How to Run Your Project

## ✅ What I Did

I've integrated your three separate folders into one organized project:

| Old Folders (You can delete these) | New Folders (Use these) |
|-------------------------------------|--------------------------|
| `Backend code/` | → | `backend/` |
| `front_end/client/` | → | `client/` |
| `front_end/server/` | → | `signaling-server/` |

## 🎯 Quick Start

### Step 1: Install Dependencies

```powershell
npm install
npm run install:all
```

### Step 2: Configure Database

**IMPORTANT:** Edit `backend/.env` and set your PostgreSQL database:

```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database_name?schema=public"
```

### Step 3: Setup Database

```powershell
npm run prisma:generate
npm run prisma:migrate
```

### Step 4: Start Everything

```powershell
npm run dev
```

### Step 5: Open Browser

Go to: **http://localhost:3000**

---

## 📁 Project Structure

```
SPM_project/
├── backend/              # 🔵 Backend API (Port 8080)
├── client/               # 🟢 React Frontend (Port 3000)  
├── signaling-server/     # 🟡 WebRTC Server (Port 5000)
├── package.json          # 📄 Root package with scripts
└── Backend code/         # ❌ OLD (can delete)
└── front_end/            # ❌ OLD (can delete)
```

---

## 🎮 What Each Service Does

1. **Backend API** (`backend/`) - Handles users, meetings, groups, attendance, files
2. **Signaling Server** (`signaling-server/`) - Handles WebRTC video/audio connections
3. **React Client** (`client/`) - The user interface for video conferencing

All three run together when you do `npm run dev`.

---

## 🔧 Available Commands

```powershell
# Start all services
npm run dev

# Start individually
npm run dev:backend      # Backend only
npm run dev:signaling    # Signaling only  
npm run dev:client       # Client only

# Database
npm run prisma:generate
npm run prisma:migrate
```

---

## ⚠️ Before Running

1. **PostgreSQL must be installed and running**
2. **Update DATABASE_URL in backend/.env**
3. **Install all dependencies** (`npm run install:all`)

---

## 🗑️ After Testing (Optional)

Once you verify everything works, delete old folders:

```powershell
Remove-Item -Recurse -Force "Backend code"
Remove-Item -Recurse -Force "front_end"
```

---

## 📚 More Help

- [HOW_TO_RUN.md](HOW_TO_RUN.md) - Detailed step-by-step
- [QUICK_START.md](QUICK_START.md) - Quick reference
- [README.md](README.md) - Full documentation

