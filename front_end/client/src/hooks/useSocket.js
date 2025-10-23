// client/src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useMeeting } from '../context/MeetingContext';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export const useSocket = (roomId) => {
  const socketRef = useRef(null);
  const { currentUser, addMessage } = useMeeting();

  useEffect(() => {
    if (!roomId || !currentUser.userName) return;

    // Initialize socket connection
    socketRef.current = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      
      // Join room after connection
      socket.emit('join-room', {
        roomId,
        userName: currentUser.userName,
        userId: currentUser.userId
      });
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    // Chat events
    socket.on('chat-message', (message) => {
      addMessage(message);
    });

    socket.on('chat-history', (messages) => {
      messages.forEach(msg => addMessage(msg));
    });

    // Cleanup
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomId, currentUser.userName, currentUser.userId]);

  return socketRef.current;
};