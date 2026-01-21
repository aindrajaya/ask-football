import React, { useEffect, useRef, useState } from 'react';
import { Message, User } from '../types';

interface ChatWindowProps {
  channelName: string;
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string) => void;
  isTyping?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  channelName, 
  messages, 
  currentUser, 
  onSendMessage,
  isTyping 
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900 relative">
      {/* Header */}
      <div className="h-16 border-b border-gray-700 flex items-center px-6 bg-gray-900 z-10 shadow-sm">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-gray-500">#</span> {channelName}
          </h2>
          <span className="text-xs text-gray-400">Real-time Pub/Sub demo</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender.id === currentUser.id;
            const isBot = msg.sender.isBot;
            const showHeader = index === 0 || messages[index - 1].sender.id !== msg.sender.id;

            return (
              <div 
                key={msg.id} 
                className={`flex gap-4 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  {showHeader ? (
                    <img 
                      src={msg.sender.avatarUrl} 
                      alt={msg.sender.username} 
                      className={`w-10 h-10 rounded-full object-cover border-2 ${isBot ? 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'border-gray-700'}`}
                    />
                  ) : (
                    <div className="w-10" /> 
                  )}
                </div>

                {/* Content */}
                <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {showHeader && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold ${isBot ? 'text-purple-400' : 'text-gray-300'}`}>
                        {msg.sender.username}
                      </span>
                      {isBot && (
                        <span className="bg-purple-500/20 text-purple-300 text-[10px] px-1.5 rounded uppercase font-bold tracking-wider border border-purple-500/30">
                          AI
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                  <div 
                    className={`px-4 py-2 rounded-2xl text-[15px] leading-relaxed shadow-sm break-words ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : isBot 
                          ? 'bg-gray-800 text-gray-100 border border-purple-900/50 rounded-tl-sm'
                          : 'bg-gray-800 text-gray-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
           <div className="flex gap-4 items-center">
             <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse"></div>
             <div className="text-xs text-gray-500 italic">Someone is typing...</div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 pt-2 bg-gray-900">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center gap-4 bg-gray-800/50 p-2 rounded-xl border border-gray-700 focus-within:border-blue-500 focus-within:bg-gray-800 transition-all duration-200 shadow-lg"
        >
          <button type="button" className="p-2 text-gray-400 hover:text-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message #${channelName}`}
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none px-2 py-2"
          />

          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        <div className="text-center mt-2 text-xs text-gray-600">
          Try opening this URL in a second tab to see real-time Pub/Sub!
        </div>
      </div>
    </div>
  );
};
