// client/src/components/Room/Controls.jsx
import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  Copy,
  Check,
} from 'lucide-react';
import { useMeeting } from '../../context/MeetingContext';

function Controls({ onLeave, socket, roomId }) {
  const {
    currentUser,
    toggleAudio,
    toggleVideo,
    localStream,
    screenStream,
    setScreenStream,
    isScreenSharing,
    setIsScreenSharing,
  } = useMeeting();

  const [copied, setCopied] = useState(false);

  const handleToggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !currentUser.audioEnabled;
      });
      toggleAudio();

      if (socket) {
        socket.emit('toggle-media', {
          roomId,
          type: 'audio',
          enabled: !currentUser.audioEnabled,
        });
      }
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !currentUser.videoEnabled;
      });
      toggleVideo();

      if (socket) {
        socket.emit('toggle-media', {
          roomId,
          type: 'video',
          enabled: !currentUser.videoEnabled,
        });
      }
    }
  };

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
      setIsScreenSharing(false);

      if (socket) {
        socket.emit('toggle-media', {
          roomId,
          type: 'screen',
          enabled: false,
        });
      }
    } else {
      // Start screen sharing
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false,
        });

        setScreenStream(stream);
        setIsScreenSharing(true);

        // Stop sharing when user clicks browser's stop button
        stream.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
          setIsScreenSharing(false);

          if (socket) {
            socket.emit('toggle-media', {
              roomId,
              type: 'screen',
              enabled: false,
            });
          }
        };

        if (socket) {
          socket.emit('toggle-media', {
            roomId,
            type: 'screen',
            enabled: true,
          });
        }
      } catch (err) {
        console.error('Error sharing screen:', err);
      }
    }
  };

  const handleCopyURL = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Audio Toggle */}
      <button
        onClick={handleToggleAudio}
        className={`p-4 rounded-full transition-all ${
          currentUser.audioEnabled
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-red-600 hover:bg-red-700'
        }`}
        title={currentUser.audioEnabled ? 'Mute' : 'Unmute'}
      >
        {currentUser.audioEnabled ? (
          <Mic className="w-6 h-6" />
        ) : (
          <MicOff className="w-6 h-6" />
        )}
      </button>

      {/* Video Toggle */}
      <button
        onClick={handleToggleVideo}
        className={`p-4 rounded-full transition-all ${
          currentUser.videoEnabled
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-red-600 hover:bg-red-700'
        }`}
        title={currentUser.videoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {currentUser.videoEnabled ? (
          <Video className="w-6 h-6" />
        ) : (
          <VideoOff className="w-6 h-6" />
        )}
      </button>

      {/* Screen Share */}
      <button
        onClick={handleScreenShare}
        className={`p-4 rounded-full transition-all ${
          isScreenSharing
            ? 'bg-green-700 hover:bg-green-600'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
        title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
      >
        <Monitor className="w-6 h-6" />
      </button>

      {/* Copy Room Link */}
      <button
        onClick={handleCopyURL}
        className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
        title="Copy Room Link"
      >
        {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
      </button>

      {/* Leave Call */}
      <button
        onClick={onLeave}
        className="p-4 rounded-full bg-red-700 hover:bg-red-800 transition-all"
        title="Leave Room"
      >
        <PhoneOff className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

export default Controls;
