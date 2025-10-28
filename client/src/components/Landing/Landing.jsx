// client/src/components/Landing/Landing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users, MessageSquare, Share2, PenTool } from 'lucide-react';
import { useMeeting } from '../../context/MeetingContext';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

function Landing() {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUserName, updateUserId } = useMeeting();

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const handleCreateRoom = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${SERVER_URL}/api/room/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      const newRoomId = data.roomId || generateRoomId();

      updateUserName(userName);
      updateUserId(Date.now().toString());
      navigate(`/room/${newRoomId}`);
    } catch (err) {
      console.error('Error creating room:', err);
      // Fallback to client-generated room ID
      const newRoomId = generateRoomId();
      updateUserName(userName);
      updateUserId(Date.now().toString());
      navigate(`/room/${newRoomId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Optional: Check if room exists
      const response = await fetch(`${SERVER_URL}/api/room/${roomId}`);
      const data = await response.json();

      updateUserName(userName);
      updateUserId(Date.now().toString());
      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error('Error checking room:', err);
      // Still allow joining even if check fails
      updateUserName(userName);
      updateUserId(Date.now().toString());
      navigate(`/room/${roomId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Video className="w-6 h-6" />,
      title: 'HD Video Calls',
      description: 'Crystal clear video quality for seamless communication'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Multiple Participants',
      description: 'Connect with multiple people at once'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Real-time Chat',
      description: 'Send messages during your video calls'
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Screen Sharing',
      description: 'Share your screen with other participants'
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      title: 'Whiteboard',
      description: 'Collaborate on a shared whiteboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <Video className="w-8 h-8 text-purple-400" />
          <h1 className="text-2xl font-bold">LetsMeet</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero */}
          <div className="space-y-6">
            <h2 className="text-5xl font-bold leading-tight">
              Connect, Collaborate,
              <span className="text-purple-400"> Communicate</span>
            </h2>
            <p className="text-xl text-gray-300">
              Premium video conferencing made simple. Join or create a meeting in seconds.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="text-purple-400 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold mb-6">Get Started</h3>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400"
                disabled={isLoading}
              />
            </div>

            {/* Create Meeting Button */}
            <button
              onClick={handleCreateRoom}
              disabled={isLoading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors mb-4 flex items-center justify-center gap-2"
            >
              <Video className="w-5 h-5" />
              {isLoading ? 'Creating...' : 'Create New Meeting'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/10 text-gray-300">Or join existing</span>
              </div>
            </div>

            {/* Join Meeting */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Meeting ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter meeting ID"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={isLoading}
              className="w-full py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed border border-white/20 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? 'Joining...' : 'Join Meeting'}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-white/10">
        <div className="text-center text-gray-400 text-sm">
          <p>Built with React, WebRTC, and Socket.io</p>
          <p className="mt-2">© 2025 Sandhipom - Secure Video Conferencing</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;