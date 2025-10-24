# SPM_project

# 🎥 LetsMeet - Video Conferencing Application

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.5.4-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-Enabled-FF6B6B?style=for-the-badge&logo=webrtc&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A full-featured video conferencing platform built with React, WebRTC, and Socket.io**

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🐛 Report Bug](#) • [✨ Request Feature](#)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 About

**LetsMeet** is a modern, real-time video conferencing application that enables seamless communication between multiple participants. Built with cutting-edge web technologies, it provides a robust platform for virtual meetings, online classes, team collaborations, and more.

### ✨ Why LetsMeet?

- 🆓 **Completely Free** - No hidden costs or premium tiers
- 🔒 **Privacy-Focused** - Peer-to-peer connections for enhanced security
- 🚀 **Easy to Use** - No sign-up required, just create and share a link
- 🎨 **Modern UI** - Clean, intuitive interface built with Tailwind CSS
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile

---

## 🌟 Features

### Core Functionality

| Feature | Description | Status |
|---------|-------------|--------|
| 📹 **HD Video Calling** | Crystal clear video quality with adaptive bitrate | ✅ Implemented |
| 🎙️ **Audio Control** | Mute/unmute with visual indicators | ✅ Implemented |
| 👥 **Multi-party Support** | Connect with multiple participants simultaneously | ✅ Implemented |
| 💬 **Real-time Chat** | Send messages during video calls | ✅ Implemented |
| 🖥️ **Screen Sharing** | Share your screen with all participants | ✅ Implemented |
| ✏️ **Collaborative Whiteboard** | Draw and collaborate in real-time | ✅ Implemented |
| 🔗 **Easy Room Sharing** | Share meeting URL with one click | ✅ Implemented |
| 🔔 **Join/Leave Notifications** | Get notified when participants join or leave | ✅ Implemented |
| 📊 **Participant Counter** | See how many people are in the meeting | ✅ Implemented |

### Advanced Features

- **Responsive Video Grid** - Automatically adjusts layout based on participant count
- **Audio/Video Indicators** - Real-time status display for all participants
- **Auto-reconnection** - Handles network disruptions gracefully
- **Browser Compatibility** - Works on Chrome, Firefox, Safari, and Edge
- **No Installation Required** - Runs entirely in the browser

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Socket.io Client** - Real-time bidirectional communication
- **Simple-peer** - WebRTC wrapper for easy peer connections

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Fast, minimalist web framework
- **Socket.io** - WebSocket library for real-time features
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

### Communication Protocols
- **WebRTC** - Peer-to-peer video/audio streaming
- **Socket.io** - Signaling and real-time messaging
- **STUN Servers** - NAT traversal for peer connections

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │    Room      │  │   Controls   │     │
│  │   Component  │  │   Component  │  │   Component  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   VideoGrid  │  │     Chat     │  │  Whiteboard  │     │
│  │   Component  │  │   Component  │  │   Component  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        MeetingContext (Global State)                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────┐              ┌──────────────┐           │
│  │  useSocket   │              │  useWebRTC   │           │
│  │     Hook     │              │     Hook     │           │
│  └──────────────┘              └──────────────┘           │
└─────────────────────────────────────────────────────────────┘
                           ↕ Socket.io
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Node.js/Express)                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Socket.io  │  │     Room     │  │     User     │     │
│  │    Server    │  │  Management  │  │  Management  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↕ WebRTC (P2P)
┌─────────────────────────────────────────────────────────────┐
│                      PEER CONNECTIONS                        │
│              (Direct Video/Audio Streaming)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- Modern web browser (Chrome recommended)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/letsmeet.git

# Navigate to the project
cd letsmeet

# Install dependencies for both client and server
cd server && npm install
cd ../client && npm install

# Start the application
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm start
```

The application will open automatically at `http://localhost:3000`

---

## 📦 Installation

### Detailed Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/letsmeet.git
cd letsmeet
```

#### 2. Server Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
echo "PORT=5000" > .env
echo "CLIENT_URL=http://localhost:3000" >> .env
```

#### 3. Client Setup
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_SERVER_URL=http://localhost:5000" > .env

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
```

#### 4. Configure Tailwind CSS

Create `tailwind.config.js`:
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#6264a7',
        secondary: '#464775',
      }
    },
  },
  plugins: [],
}
```

Create `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 5. Run the Application
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm start
```

---

## 💻 Usage

### Creating a Meeting

1. Open the application in your browser
2. Enter your name
3. Click "Create New Meeting"
4. Allow camera and microphone permissions
5. Share the meeting URL with participants

### Joining a Meeting

1. Click on the shared meeting link
2. Enter your name
3. Click "Join Meeting"
4. Allow camera and microphone permissions

### During a Meeting

- **Mute/Unmute**: Click the microphone icon
- **Camera On/Off**: Click the video camera icon
- **Screen Share**: Click the monitor icon
- **Chat**: Click the message icon to open chat sidebar
- **Whiteboard**: Click the pen icon to open collaborative whiteboard
- **Copy URL**: Click the copy icon to share meeting link
- **Leave**: Click the red phone icon to leave the meeting

---

## 📁 Project Structure

```
letsmeet/
├── client/                      # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Landing/
│   │   │   │   └── Landing.jsx
│   │   │   └── Room/
│   │   │       ├── Room.jsx
│   │   │       ├── VideoGrid.jsx
│   │   │       ├── Controls.jsx
│   │   │       ├── Chat.jsx
│   │   │       └── Whiteboard.jsx
│   │   ├── hooks/
│   │   │   ├── useSocket.js
│   │   │   └── useWebRTC.js
│   │   ├── context/
│   │   │   └── MeetingContext.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env
│
└── server/                      # Node.js backend
    ├── server.js
    ├── package.json
    └── .env
```

---

## 🔌 API Documentation

### Socket Events

#### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join-room` | `{ roomId, userName, userId }` | Join a meeting room |
| `offer` | `{ offer, to }` | Send WebRTC offer |
| `answer` | `{ answer, to }` | Send WebRTC answer |
| `ice-candidate` | `{ candidate, to }` | Exchange ICE candidates |
| `chat-message` | `{ roomId, message, userName }` | Send chat message |
| `toggle-media` | `{ roomId, type, enabled }` | Update media status |
| `whiteboard-draw` | `{ roomId, data }` | Update whiteboard |
| `leave-room` | - | Leave the meeting |

#### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `existing-users` | `Array<User>` | List of users already in room |
| `user-joined` | `{ socketId, userName, ... }` | New user joined |
| `user-left` | `{ socketId, userName }` | User left the meeting |
| `offer` | `{ offer, from }` | Receive WebRTC offer |
| `answer` | `{ answer, from }` | Receive WebRTC answer |
| `ice-candidate` | `{ candidate, from }` | Receive ICE candidate |
| `chat-message` | `{ id, message, userName, timestamp }` | Receive chat message |
| `user-media-changed` | `{ socketId, type, enabled }` | User toggled media |

### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server health check |
| POST | `/api/room/create` | Create new meeting room |
| GET | `/api/room/:roomId` | Check if room exists |

---

## 📸 Screenshots

### Landing Page
*Beautiful, intuitive interface for creating or joining meetings*

### Video Meeting
*Multi-party video conferencing with responsive grid layout*

### Chat Interface
*Real-time messaging sidebar during meetings*

### Collaborative Whiteboard
*Draw and collaborate with multiple participants*

---

## 🗺️ Roadmap

### Phase 1 (Completed) ✅
- [x] Basic video calling functionality
- [x] Audio/video controls
- [x] Real-time chat
- [x] Screen sharing
- [x] Collaborative whiteboard
- [x] Responsive UI

### Phase 2 (In Progress) 🚧
- [ ] User authentication (Sign up/Login)
- [ ] Meeting scheduling
- [ ] Recording functionality
- [ ] Virtual backgrounds
- [ ] Waiting room
- [ ] Host controls (kick, mute participants)

### Phase 3 (Planned) 📅
- [ ] Breakout rooms
- [ ] Meeting analytics
- [ ] File sharing
- [ ] Reactions and emojis
- [ ] End-to-end encryption
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Known Issues

- Screen sharing may not work on Safari (WebRTC limitation)
- Maximum 6 participants recommended for optimal performance
- TURN server required for users behind strict NATs

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Contact
kritstudy15@gmail.com


## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Socket.io](https://socket.io/)
- [WebRTC](https://webrtc.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Simple-peer](https://github.com/feross/simple-peer)

---

## 📊 Project Statistics

![GitHub stars](https://img.shields.io/github/stars/yourusername/letsmeet?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/letsmeet?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/letsmeet?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/letsmeet)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/letsmeet)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
