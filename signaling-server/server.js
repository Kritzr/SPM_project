 // server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store active rooms and users
const rooms = new Map();
const users = new Map();

// Room class to manage room state
class Room {
  constructor(roomId) {
    this.roomId = roomId;
    this.users = new Map();
    this.messages = [];
    this.whiteboardData = [];
  }

  addUser(socketId, userData) {
    this.users.set(socketId, {
      socketId,
      ...userData,
      joinedAt: Date.now()
    });
  }

  removeUser(socketId) {
    this.users.delete(socketId);
    if (this.users.size === 0) {
      return true; // Room is empty
    }
    return false;
  }

  getUsers() {
    return Array.from(this.users.values());
  }

  addMessage(message) {
    this.messages.push({
      ...message,
      timestamp: Date.now()
    });
  }

  updateWhiteboard(data) {
    this.whiteboardData = data;
  }
}

// API Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'sandhipom Server Running',
    activeRooms: rooms.size,
    activeUsers: users.size
  });
});

// Create a new room
app.post('/api/room/create', (req, res) => {
  const roomId = uuidv4();
  rooms.set(roomId, new Room(roomId));
  res.json({ roomId });
});

// Check if room exists
app.get('/api/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const roomExists = rooms.has(roomId);
  
  if (roomExists) {
    const room = rooms.get(roomId);
    res.json({ 
      exists: true,
      userCount: room.users.size
    });
  } else {
    res.json({ exists: false });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join room
  socket.on('join-room', ({ roomId, userName, userId }) => {
    console.log(`${userName} (${socket.id}) joining room: ${roomId}`);

    // Create room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Room(roomId));
    }

    const room = rooms.get(roomId);
    
    // Store user info
    const userData = {
      userId: userId || socket.id,
      userName: userName || 'Anonymous',
      audioEnabled: true,
      videoEnabled: true,
      isScreenSharing: false
    };

    users.set(socket.id, { ...userData, roomId });
    room.addUser(socket.id, userData);

    // Join socket room
    socket.join(roomId);

    // Get existing users in room (excluding the new user)
    const existingUsers = room.getUsers().filter(u => u.socketId !== socket.id);

    // Send existing users to the new user
    socket.emit('existing-users', existingUsers);

    // Notify others about new user
    socket.to(roomId).emit('user-joined', {
      socketId: socket.id,
      ...userData
    });

    // Send chat history
    socket.emit('chat-history', room.messages);

    // Send whiteboard data
    socket.emit('whiteboard-data', room.whiteboardData);

    console.log(`Room ${roomId} now has ${room.users.size} users`);
  });

  // WebRTC Signaling - Offer
  socket.on('offer', ({ offer, to }) => {
    console.log(`Offer from ${socket.id} to ${to}`);
    io.to(to).emit('offer', {
      offer,
      from: socket.id
    });
  });

  // WebRTC Signaling - Answer
  socket.on('answer', ({ answer, to }) => {
    console.log(`Answer from ${socket.id} to ${to}`);
    io.to(to).emit('answer', {
      answer,
      from: socket.id
    });
  });

  // WebRTC Signaling - ICE Candidate
  socket.on('ice-candidate', ({ candidate, to }) => {
    io.to(to).emit('ice-candidate', {
      candidate,
      from: socket.id
    });
  });

  // Chat message
  socket.on('chat-message', ({ roomId, message, userName }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      const chatMessage = {
        id: uuidv4(),
        socketId: socket.id,
        userName,
        message,
        timestamp: Date.now()
      };
      
      room.addMessage(chatMessage);
      
      // Broadcast to all users in room including sender
      io.to(roomId).emit('chat-message', chatMessage);
    }
  });

  // Update user media state
  socket.on('toggle-media', ({ roomId, type, enabled }) => {
    const user = users.get(socket.id);
    if (user && rooms.has(roomId)) {
      if (type === 'audio') {
        user.audioEnabled = enabled;
      } else if (type === 'video') {
        user.videoEnabled = enabled;
      } else if (type === 'screen') {
        user.isScreenSharing = enabled;
      }

      // Notify other users
      socket.to(roomId).emit('user-media-changed', {
        socketId: socket.id,
        type,
        enabled
      });
    }
  });

  // Whiteboard update
  socket.on('whiteboard-draw', ({ roomId, data }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.updateWhiteboard(data);
      
      // Broadcast to others
      socket.to(roomId).emit('whiteboard-draw', data);
    }
  });

  // Whiteboard clear
  socket.on('whiteboard-clear', ({ roomId }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.updateWhiteboard([]);
      
      // Broadcast to others
      socket.to(roomId).emit('whiteboard-clear');
    }
  });

  // Leave room
  socket.on('leave-room', () => {
    handleUserDisconnect(socket);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    handleUserDisconnect(socket);
  });

  // Helper function to handle user disconnect
  function handleUserDisconnect(socket) {
    const user = users.get(socket.id);
    
    if (user && user.roomId) {
      const roomId = user.roomId;
      const room = rooms.get(roomId);

      if (room) {
        const userName = user.userName;
        const isEmpty = room.removeUser(socket.id);

        // Notify others in room
        socket.to(roomId).emit('user-left', {
          socketId: socket.id,
          userName
        });

        // Delete room if empty
        if (isEmpty) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted (empty)`);
        } else {
          console.log(`Room ${roomId} now has ${room.users.size} users`);
        }
      }

      users.delete(socket.id);
    }
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});