// client/src/hooks/useWebRTC.js
import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'simple-peer';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
};

export const useWebRTC = (socket, roomId, currentUser) => {
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const peersRef = useRef([]);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  // Initialize local media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        localStreamRef.current = stream;
        setLocalStream(stream);
        console.log('✅ Local stream initialized');
      } catch (error) {
        console.error('❌ Error accessing media devices:', error);
        
        // Try audio only if video fails
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
          });
          localStreamRef.current = audioStream;
          setLocalStream(audioStream);
          setIsVideoEnabled(false);
          console.log('⚠️ Audio-only stream initialized');
        } catch (audioError) {
          console.error('❌ Error accessing audio:', audioError);
        }
      }
    };

    initializeMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Create peer connection (initiator)
  const createPeer = useCallback((userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: true,
      stream,
      config: ICE_SERVERS
    });

    peer.on('signal', signal => {
      socket.emit('send-offer', {
        userToSignal,
        callerID,
        signal
      });
    });

    peer.on('error', err => {
      console.error('Peer error (createPeer):', err);
    });

    peer.on('close', () => {
      console.log('Peer connection closed');
    });

    return peer;
  }, [socket]);

  // Add peer connection (receiver)
  const addPeer = useCallback((incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: true,
      stream,
      config: ICE_SERVERS
    });

    peer.on('signal', signal => {
      socket.emit('send-answer', {
        signal,
        callerID
      });
    });

    peer.on('error', err => {
      console.error('Peer error (addPeer):', err);
    });

    peer.on('close', () => {
      console.log('Peer connection closed');
    });

    peer.signal(incomingSignal);

    return peer;
  }, [socket]);

  // Handle socket events for WebRTC signaling
  useEffect(() => {
    if (!socket || !localStreamRef.current) return;

    // Handle existing users in room
    socket.on('existing-users', (users) => {
      console.log('🔗 Existing users:', users);
      
      const newPeers = [];
      users.forEach(user => {
        const peer = createPeer(user.socketId, socket.id, localStreamRef.current);
        
        peersRef.current.push({
          peerID: user.socketId,
          peer,
          userName: user.userName,
          userId: user.userId,
          audioEnabled: true,
          videoEnabled: true
        });
        
        newPeers.push({
          peerID: user.socketId,
          peer,
          userName: user.userName,
          userId: user.userId,
          audioEnabled: true,
          videoEnabled: true
        });
      });
      
      setPeers(newPeers);
    });

    // Handle new user joined
    socket.on('user-joined', (payload) => {
      console.log('👤 User joined:', payload.userName);
      
      const peer = addPeer(payload.signal, payload.callerID, localStreamRef.current);
      
      const newPeer = {
        peerID: payload.callerID,
        peer,
        userName: payload.userName,
        userId: payload.userId,
        audioEnabled: true,
        videoEnabled: true
      };
      
      peersRef.current.push(newPeer);
      setPeers(prevPeers => [...prevPeers, newPeer]);
    });

    // Handle receiving offer
    socket.on('receive-offer', (payload) => {
      console.log('📨 Received offer from:', payload.callerID);
      
      const peer = addPeer(payload.signal, payload.callerID, localStreamRef.current);
      
      const newPeer = {
        peerID: payload.callerID,
        peer,
        userName: payload.userName,
        userId: payload.userId,
        audioEnabled: true,
        videoEnabled: true
      };
      
      peersRef.current.push(newPeer);
      setPeers(prevPeers => [...prevPeers, newPeer]);
    });

    // Handle receiving answer
    socket.on('receive-answer', (payload) => {
      console.log('📬 Received answer from:', payload.callerID);
      
      const item = peersRef.current.find(p => p.peerID === payload.callerID);
      if (item) {
        item.peer.signal(payload.signal);
      }
    });

    // Handle user audio toggle
    socket.on('user-audio-toggle', ({ userId, audioEnabled }) => {
      setPeers(prevPeers =>
        prevPeers.map(peer =>
          peer.peerID === userId
            ? { ...peer, audioEnabled }
            : peer
        )
      );
    });

    // Handle user video toggle
    socket.on('user-video-toggle', ({ userId, videoEnabled }) => {
      setPeers(prevPeers =>
        prevPeers.map(peer =>
          peer.peerID === userId
            ? { ...peer, videoEnabled }
            : peer
        )
      );
    });

    // Handle user left
    socket.on('user-left', ({ userId }) => {
      console.log('👋 User left:', userId);
      
      const peerIndex = peersRef.current.findIndex(p => p.peerID === userId);
      if (peerIndex !== -1) {
        peersRef.current[peerIndex].peer.destroy();
        peersRef.current.splice(peerIndex, 1);
        setPeers(prevPeers => prevPeers.filter(p => p.peerID !== userId));
      }
    });

    return () => {
      socket.off('existing-users');
      socket.off('user-joined');
      socket.off('receive-offer');
      socket.off('receive-answer');
      socket.off('user-audio-toggle');
      socket.off('user-video-toggle');
      socket.off('user-left');
    };
  }, [socket, createPeer, addPeer]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        socket.emit('toggle-audio', {
          roomId,
          audioEnabled: audioTrack.enabled
        });
      }
    }
  }, [socket, roomId]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        socket.emit('toggle-video', {
          roomId,
          videoEnabled: videoTrack.enabled
        });
      }
    }
  }, [socket, roomId]);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }

      // Switch back to camera
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        peersRef.current.forEach(({ peer }) => {
          const sender = peer._pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
      }

      setIsScreenSharing(false);
      socket.emit('stop-screen-share', { roomId });
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: 'always'
          },
          audio: false
        });

        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace video track for all peers
        peersRef.current.forEach(({ peer }) => {
          const sender = peer._pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });

        // Handle screen share stop
        screenTrack.onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);
        socket.emit('start-screen-share', { roomId });
      } catch (err) {
        console.error('Error sharing screen:', err);
      }
    }
  }, [isScreenSharing, socket, roomId]);

  // Clean up peers
  const destroyPeers = useCallback(() => {
    peersRef.current.forEach(({ peer }) => {
      peer.destroy();
    });
    peersRef.current = [];
    setPeers([]);
  }, []);

  return {
    localStream,
    peers,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    destroyPeers
  };
};