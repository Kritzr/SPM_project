// client/src/components/Room/Chat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useMeeting } from '../../context/MeetingContext';

function Chat({ socket, roomId }) {
  const { messages, currentUser } = useMeeting();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim() || !socket) return;

    socket.emit('chat-message', {
      roomId,
      message: message.trim(),
      userName: currentUser.userName
    });

    setMessage('');
    inputRef.current?.focus();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOwnMessage = (msg) => {
    return msg.socketId === socket?.id;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-2">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isOwnMessage(msg) ? 'items-end' : 'items-start'
              }`}
            >
              {/* User name and time */}
              <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
                {!isOwnMessage(msg) && <span className="font-medium">{msg.userName}</span>}
                <span>{formatTime(msg.timestamp)}</span>
                {isOwnMessage(msg) && <span className="font-medium">You</span>}
              </div>

              {/* Message bubble */}
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg break-words ${
                  isOwnMessage(msg)
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-gray-700 text-white rounded-tl-none'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-700 bg-gray-800"
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {message.length > 400 && (
          <p className="text-xs text-gray-400 mt-1">
            {500 - message.length} characters remaining
          </p>
        )}
      </form>
    </div>
  );
}

export default Chat;