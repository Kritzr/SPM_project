# 🎥 Meeting Platform - SPM Project

A full-featured video conferencing platform built with React, WebRTC, Express, and Socket.io.

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?style=flat-square&logo=socket.io)
![WebRTC](https://img.shields.io/badge/WebRTC-Enabled-FF6B6B?style=flat-square&logo=webrtc)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)

---

## 🎯 About

This is an integrated meeting platform that combines:
- **Backend API** - RESTful API for user management, meetings, groups, and attendance
- **Signaling Server** - WebRTC signaling server for real-time video/audio connections
- **React Client** - Modern frontend for video conferencing with chat and whiteboard

### Key Features

- 🆓 **Free & Open Source**
- 🔒 **Secure** - JWT authentication and encrypted communications
- 🚀 **Easy to Deploy** - All services integrated and configured
- 📱 **Responsive** - Works on desktop, tablet, and mobile

---

## ✨ Features

### Core Functionality

| Feature | Description | Status |
|---------|-------------|--------|
| 📹 **HD Video Calling** | Crystal clear video quality with adaptive bitrate | ✅ Implemented |
| 🎙️ **Audio Control** | Mute/unmute with visual indicators | ✅ Implemented |
| 👥 **Multi-party Support** | Connect with multiple participants simultaneously | ✅ Implemented |
| 💬 **Real-time Chat** | Send messages during video calls | ✅ Implemented |
| 🖥️ **Screen Sharing** | Share your screen with all participants | ✅ Implemented |
| ✏️ **Collaborative Whiteboard** | Draw and collaborate in real-time | ✅ Implemented |
| 👤 **User Management** | Registration, authentication, and profiles | ✅ Implemented |
| 👥 **Group Management** | Create and manage groups | ✅ Implemented |
| 📅 **Meeting Scheduling** | Schedule and manage meetings | ✅ Implemented |
| ✅ **Attendance Tracking** | Track meeting attendance | ✅ Implemented |
| 📁 **File Uploads** | Upload and manage files (Azure Blob Storage) | ✅ Implemented |

---

## 🛠️ Tech Stack

### Backend
- **Express** - Web framework
- **Prisma** - ORM for PostgreSQL
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Azure Blob Storage** - File storage
- **CORS** - Cross-origin requests

### Signaling Server
- **Socket.io** - WebSocket server
- **Express** - HTTP server
- **UUID** - Unique identifiers

### Frontend
- **React 19** - UI framework
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Simple-peer** - WebRTC wrapper
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Client (Port 3000)                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│  │  Landing   │  │    Room    │  │  Controls  │          │
│  └────────────┘  └────────────┘  └────────────┘          │
│  ┌─────────────────────────────────────────────────┐      │
│  │        MeetingContext (Global State)            │      │
│  └─────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                      ↕ Socket.io
┌─────────────────────────────────────────────────────────────┐
│              Signaling Server (Port 5000)                     │
│           WebRTC Signaling & Real-time Events                │
└─────────────────────────────────────────────────────────────┘
                      ↕ HTTP REST
┌─────────────────────────────────────────────────────────────┐
│              Backend API Server (Port 8080)                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│  │   Auth     │  │   Groups   │  │  Meetings  │          │
│  └────────────┘  └────────────┘  └────────────┘          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│  │Attendance │  │   Files    │  │   Users    │          │
│  └────────────┘  └────────────┘  └────────────┘          │
│  ┌─────────────────────────────────────────────────┐      │
│  │          Prisma ORM + PostgreSQL                │      │
│  └─────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database
- (Optional) Azure Blob Storage account

### Quick Start

```bash
# 1. Install root dependencies
npm install

# 2. Install all service dependencies
npm run install:all

# 3. Configure environment variables
# Copy and edit the example files:
cp backend/env.example backend/.env
cp signaling-server/env.example signaling-server/.env
cp client/env.example client/.env

# 4. Setup database
npm run prisma:generate
npm run prisma:migrate

# 5. Start all services
npm run dev
```

### Detailed Setup

See [SETUP.md](SETUP.md) for complete setup instructions.

---

## 📁 Project Structure

```
SPM_project/
├── backend/                      # Express API Server (Port 8080)
│   ├── src/
│   │   ├── routes/              # API Routes (auth, groups, meetings, attendance, files)
│   │   ├── middleware/          # Authentication middleware
│   │   ├── services/            # Business logic (Azure Blob)
│   │   ├── utils/               # Helper functions (JWT)
│   │   └── app.js               # Express app configuration
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   └── package.json
│
├── signaling-server/             # Socket.io Server (Port 5000)
│   ├── server.js                # WebRTC signaling server
│   └── package.json
│
├── client/                       # React Frontend (Port 3000)
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Landing/         # Landing page
│   │   │   └── Room/            # Room page (VideoGrid, Chat, Controls, Whiteboard)
│   │   ├── hooks/               # Custom hooks (useSocket, useWebRTC)
│   │   ├── context/             # React context (MeetingContext)
│   │   └── App.js               # Main app component
│   └── package.json
│
├── package.json                  # Root package with scripts
├── .gitignore                    # Git ignore rules
└── SETUP.md                      # Detailed setup guide
```

---

## 💻 Usage

### Development

Start all services in development mode:

```bash
npm run dev
```

Or run services individually:

```bash
npm run dev:backend      # Backend API only
npm run dev:signaling    # Signaling server only
npm run dev:client       # React client only
```

### Services

Once running, you can access:

- **React Client**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Signaling Server**: http://localhost:5000 (WebSocket)

### Using the Application

1. **Create a Meeting**
   - Open http://localhost:3000
   - Enter your name
   - Click "Create New Meeting"
   - Allow camera/microphone permissions
   - Share the meeting URL with participants

2. **Join a Meeting**
   - Click the shared meeting link
   - Enter your name
   - Click "Join Meeting"
   - Allow camera/microphone permissions

3. **During a Meeting**
   - **Mute/Unmute**: Click microphone icon
   - **Camera On/Off**: Click video icon
   - **Screen Share**: Click monitor icon
   - **Chat**: Click message icon
   - **Whiteboard**: Click pen icon
   - **Copy URL**: Click copy icon
   - **Leave**: Click phone icon

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

### Meetings
- `GET /api/meetings` - Get all meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/:id` - Get meeting details
- `PUT /api/meetings/:id` - Update meeting

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance

### Files
- `GET /api/files` - List files
- `POST /api/files` - Upload file

---

## 🔧 Configuration

Each service requires environment variables. See:
- `backend/env.example`
- `signaling-server/env.example`
- `client/env.example`

Copy these to `.env` files and configure according to your setup.

---

## 🐛 Troubleshooting

### Port Conflicts
If a port is already in use, update the PORT in the respective `.env` file.

### Database Connection
Ensure PostgreSQL is running and the DATABASE_URL in `backend/.env` is correct.

### CORS Issues
Update CLIENT_URL in backend and signaling server `.env` files to match your client URL.

---

## 📝 License

ISC

---

## 👤 Contact

For questions or support, contact: kritstudy15@gmail.com

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

</div>
