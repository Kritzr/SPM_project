// client/src/context/MeetingContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const MeetingContext = createContext();

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeeting must be used within MeetingProvider');
  }
  return context;
};

export const MeetingProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('letsmeet_user');
    return saved ? JSON.parse(saved) : {
      userId: null,
      userName: '',
      audioEnabled: true,
      videoEnabled: true
    };
  });

  const [roomId, setRoomId] = useState(null);
  const [peers, setPeers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    localStorage.setItem('letsmeet_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const updateUserName = (name) => {
    setCurrentUser(prev => ({ ...prev, userName: name }));
  };

  const updateUserId = (id) => {
    setCurrentUser(prev => ({ ...prev, userId: id }));
  };

  const toggleAudio = () => {
    setCurrentUser(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }));
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !currentUser.audioEnabled;
      });
    }
  };

  const toggleVideo = () => {
    setCurrentUser(prev => ({ ...prev, videoEnabled: !prev.videoEnabled }));
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !currentUser.videoEnabled;
      });
    }
  };

  const addPeer = (peer) => {
    setPeers(prev => {
      const exists = prev.find(p => p.socketId === peer.socketId);
      if (exists) return prev;
      return [...prev, peer];
    });
  };

  const removePeer = (socketId) => {
    setPeers(prev => prev.filter(p => p.socketId !== socketId));
  };

  const updatePeer = (socketId, updates) => {
    setPeers(prev => prev.map(p => 
      p.socketId === socketId ? { ...p, ...updates } : p
    ));
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const resetMeeting = () => {
    setRoomId(null);
    setPeers([]);
    setMessages([]);
    setIsChatOpen(false);
    setIsWhiteboardOpen(false);
    setLocalStream(null);
    setScreenStream(null);
    setIsScreenSharing(false);
  };

  const value = {
    currentUser,
    updateUserName,
    updateUserId,
    toggleAudio,
    toggleVideo,
    roomId,
    setRoomId,
    peers,
    addPeer,
    removePeer,
    updatePeer,
    messages,
    addMessage,
    clearMessages,
    isChatOpen,
    setIsChatOpen,
    isWhiteboardOpen,
    setIsWhiteboardOpen,
    localStream,
    setLocalStream,
    screenStream,
    setScreenStream,
    isScreenSharing,
    setIsScreenSharing,
    resetMeeting
  };

  return (
    <MeetingContext.Provider value={value}>
      {children}
    </MeetingContext.Provider>
  );
};