// client/src/components/Room/Room.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMeeting } from '../../context/MeetingContext';
import { useSocket } from '../../hooks/useSocket';
import { useWebRTC } from '../../hooks/useWebRTC';
import VideoGrid from './VideoGrid';
import Controls from './Controls';
import Chat from './Chat';
import Whiteboard from './Whiteboard';
import { Users, MessageSquare, PenTool, X } from 'lucide-react';

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    setRoomId,
    peers,
    isChatOpen,
    setIsChatOpen,
    isWhiteboardOpen,
    setIsWhiteboardOpen,
    localStream,
    setLocalStream,
    resetMeeting
  } = useMeeting();

  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const localVideoRef = useRef(null);

  // Initialize socket connection
  const socket = useSocket(roomId);

  // Initialize WebRTC connections
  useWebRTC(socket, localStream);

  // Get user media on mount
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        setLocalStream(stream);

        // Apply initial media states
        stream.getAudioTracks().forEach(track => {
          track.enabled = currentUser.audioEnabled;
        });
        stream.getVideoTracks().forEach(track => {
          track.enabled = currentUser.videoEnabled;
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setIsInitializing(false);
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setError('Unable to access camera/microphone. Please check permissions.');
        setIsInitializing(false);
      }
    };

    if (!localStream) {
      initializeMedia();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Set room ID in context
  useEffect(() => {
    setRoomId(roomId);
  }, [roomId, setRoomId]);

  // Update local video ref when stream changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleLeave = () => {
    if (socket) {
      socket.emit('leave-room');
      socket.disconnect();
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    resetMeeting();
    navigate('/');
  };

  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl">Initializing meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Unable to Join Meeting</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">LetsMeet</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{peers.length + 1} participant{peers.length !== 0 ? 's' : ''}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isChatOpen ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Toggle Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsWhiteboardOpen(!isWhiteboardOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isWhiteboardOpen ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Toggle Whiteboard"
          >
            <PenTool className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 relative">
          <VideoGrid
            localVideoRef={localVideoRef}
            localStream={localStream}
            peers={peers}
          />

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <Controls onLeave={handleLeave} socket={socket} roomId={roomId} />
          </div>
        </div>

        {/* Chat Sidebar */}
        {isChatOpen && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold">Chat</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Chat socket={socket} roomId={roomId} />
          </div>
        )}
      </div>

      {/* Whiteboard Modal */}
      {isWhiteboardOpen && (
        <Whiteboard
          socket={socket}
          roomId={roomId}
          onClose={() => setIsWhiteboardOpen(false)}
        />
      )}
    </div>
  );
}

export default Room;