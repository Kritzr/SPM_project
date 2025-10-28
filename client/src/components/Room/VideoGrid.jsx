import React, { useRef, useEffect } from 'react';
import { useMeeting } from '../../context/MeetingContext';
import { Mic, MicOff, VideoOff, User } from 'lucide-react';

const VideoPlayer = ({ stream, userName, isLocal, audioEnabled, videoEnabled }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream instanceof MediaStream) {
      console.log(`🎥 Setting video stream for ${userName} (${isLocal ? 'local' : 'remote'})`);
      videoRef.current.srcObject = stream;
      
      // Ensure video tracks are enabled
      const videoTracks = stream.getVideoTracks();
      console.log(`📹 Video tracks:`, videoTracks.length);
      videoTracks.forEach(track => {
        console.log(`Track enabled:`, track.enabled);
        track.enabled = true;
      });

      // Force a play attempt
      videoRef.current.play()
        .then(() => console.log('▶️ Video playback started'))
        .catch(e => console.error('❌ Video playback failed:', e));
    } else {
      console.warn(`⚠️ Stream not available for ${userName}`);
    }
  }, [stream, userName, isLocal]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
      {stream && videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isLocal ? 'scaleX(-1)' : 'none',
            backgroundColor: 'black'
          }}
          onLoadedMetadata={() => {
            console.log('🎵 Video metadata loaded');
            videoRef.current?.play()
              .then(() => console.log('▶️ Video started playing'))
              .catch(e => console.error("❌ Playback error:", e));
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-3">
              <User className="w-10 h-10" />
            </div>
            <p className="text-sm text-gray-300">{userName}</p>
          </div>
        </div>
      )}

      {/* User name overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium truncate">
            {userName} {isLocal && '(You)'}
          </span>
          <div className="flex items-center gap-2">
            {audioEnabled ? (
              <Mic className="w-4 h-4 text-white" />
            ) : (
              <MicOff className="w-4 h-4 text-red-500" />
            )}
            {!videoEnabled && <VideoOff className="w-4 h-4 text-red-500" />}
          </div>
        </div>
      </div>

      {/* Local indicator */}
      {isLocal && (
        <div className="absolute top-3 left-3 px-2 py-1 bg-purple-600 rounded text-xs font-medium">
          You
        </div>
      )}
    </div>
  );
};

function VideoGrid({ localStream, peers }) {
  const { currentUser } = useMeeting();

  const totalParticipants = peers.length + 1;

  // Determine grid layout based on participant count
  const getGridLayout = () => {
    if (totalParticipants === 1) return 'grid-cols-1';
    if (totalParticipants === 2) return 'grid-cols-2';
    if (totalParticipants <= 4) return 'grid-cols-2';
    if (totalParticipants <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  useEffect(() => {
    console.log("👥 Total participants:", totalParticipants);
    console.log("📹 Local stream active:", !!localStream);
  }, [localStream, totalParticipants]);

  return (
    <div className="h-full w-full p-4 overflow-auto bg-gray-900">
      <div className={`grid ${getGridLayout()} gap-4 auto-rows-fr h-full`}>
        {/* Local video */}
        <VideoPlayer
          stream={localStream}
          userName={currentUser?.userName || "You"}
          isLocal={true}
          audioEnabled={currentUser?.audioEnabled ?? true}
          videoEnabled={currentUser?.videoEnabled ?? true}
        />

        {/* Remote videos */}
        {peers.map((peer) => (
          <VideoPlayer
            key={peer.socketId}
            stream={peer.stream}
            userName={peer.userName}
            isLocal={false}
            audioEnabled={peer.audioEnabled}
            videoEnabled={peer.videoEnabled}
          />
        ))}
      </div>
    </div>
  );
}

export default VideoGrid;
