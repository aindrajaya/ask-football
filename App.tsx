import React, { useEffect, useState, useCallback } from 'react';
import { ChannelList } from './components/ChannelList';
import { ChatWindow } from './components/ChatWindow';
import { pubSub } from './services/pubSubService';
import { aiClient, initializeAIClient } from './services';
import { checkRateLimit, recordMessage, getRateLimitStatus } from './services/rateLimitService';
import { Channel, Message, PubSubEvent, PubSubPayload, User } from './types';

// Initialize the AI provider on app startup
initializeAIClient();

// Football-focused channels for high-quality discussion
const MOCK_CHANNELS: Channel[] = [
  { id: 'match-analysis', name: 'match-analysis', description: 'Tactical breakdowns, xG, lineups & key moments' },
  { id: 'transfer-talk', name: 'transfer-talk', description: 'Rumors, confirmed moves & transfer strategy' },
  { id: 'matchday-chat', name: 'matchday-chat', description: 'Live reactions, chants & play-by-play commentary' },
];

const BOT_USER: User = {
  id: 'ai-bot',
  username: 'Tactics Bot',
  avatarUrl: 'https://picsum.photos/seed/football/200/200',
  isBot: true,
};

const App: React.FC = () => {
  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string>('match-analysis');
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'match-analysis': [],
    'transfer-talk': [],
    'matchday-chat': [],
  });
  const [aiEnabled, setAiEnabled] = useState<boolean>(true);
  const [rateLimitStatus, setRateLimitStatus] = useState<{
    canChat: boolean;
    messagesRemaining: number;
    messagesUsed: number;
    resetTime: string;
  } | null>(null);

  // Initialize User on Mount
  useEffect(() => {
    // Generate a random user identity for this session
    const randomId = Math.floor(Math.random() * 10000).toString();
    const user: User = {
      id: `user-${randomId}`,
      username: `Guest${randomId}`,
      avatarUrl: `https://picsum.photos/seed/${randomId}/200/200`,
    };
    setCurrentUser(user);

    // Check rate limit on load
    getRateLimitStatus().then(status => {
      setRateLimitStatus(status);
    });
  }, []);

  // Handle incoming PubSub messages
  const handleIncomingMessage = useCallback((payload: PubSubPayload, channelId: string) => {
    if (payload.type === PubSubEvent.MESSAGE) {
      const message: Message = payload.payload;
      setMessages(prev => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), message]
      }));
    }
  }, []);

  // Subscribe to channel changes
  useEffect(() => {
    // Subscribe to the active channel
    const unsubscribe = pubSub.subscribe(activeChannelId, (data) => {
      handleIncomingMessage(data, activeChannelId);
    });

    return () => {
      unsubscribe();
    };
  }, [activeChannelId, handleIncomingMessage]);

  // Handler for sending messages
  const handleSendMessage = async (text: string) => {
    if (!currentUser) return;

    // Check rate limit
    const limitStatus = await checkRateLimit();
    setRateLimitStatus(limitStatus);

    if (!limitStatus.canChat) {
      alert(`You've reached your daily limit of 3 messages. Try again tomorrow at ${limitStatus.resetTime}`);
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: currentUser,
      timestamp: Date.now(),
      channel: activeChannelId,
    };

    // 1. Publish user message to the channel
    pubSub.publish(activeChannelId, {
      type: PubSubEvent.MESSAGE,
      payload: newMessage,
    });

    // 2. Record message for rate limiting
    await recordMessage();

    // 3. If AI is enabled, trigger a response
    if (aiEnabled) {
      // Get current history for context
      const history = messages[activeChannelId] || [];
      const context = [...history, newMessage];

      // Simulate a small delay for "thinking"
      setTimeout(async () => {
        try {
          const responseText = await aiClient.generateResponse(text, context, activeChannelId);
          
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: responseText,
            sender: BOT_USER,
            timestamp: Date.now(),
            channel: activeChannelId,
          };

          pubSub.publish(activeChannelId, {
            type: PubSubEvent.MESSAGE,
            payload: botMessage
          });
        } catch (err) {
          console.error("AI failed to respond", err);
        }
      }, 600);
    }
  };

  if (!currentUser) return <div className="h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;

  const activeChannel = MOCK_CHANNELS.find(c => c.id === activeChannelId) || MOCK_CHANNELS[0];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-900 text-gray-100 font-sans">
      {/* Sidebar */}
      <ChannelList 
        channels={MOCK_CHANNELS}
        activeChannelId={activeChannelId}
        onSelectChannel={setActiveChannelId}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow 
          channelName={activeChannel.name}
          messages={messages[activeChannelId] || []}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Settings Panel (Right Side) */}
      <div className="w-64 bg-gray-800 border-l border-gray-700 p-4 hidden lg:block">
        <div className="flex flex-col items-center mb-6">
          <img 
            src={currentUser.avatarUrl} 
            alt="Profile" 
            className="w-20 h-20 rounded-full border-4 border-gray-700 mb-3 shadow-lg"
          />
          <h3 className="text-lg font-bold">{currentUser.username}</h3>
          <span className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </span>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">AI Companion</h4>
            <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${aiEnabled ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Tactics Bot</span>
              </div>
              <button 
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${aiEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${aiEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 leading-tight">
              When enabled, the AI bot will read messages in this channel and respond with football insights.
            </p>
          </div>

          <div>
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Pub/Sub Info</h4>
             <div className="text-xs text-gray-400 space-y-2">
               <p>Provider: <span className="text-blue-400">BroadcastChannel</span></p>
               <p>Status: <span className="text-green-400">Simulated Connected</span></p>
               <div className="p-2 bg-gray-900 rounded border border-gray-700 font-mono text-[10px] break-all">
                 channel: {activeChannelId}
               </div>
             </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Daily Rate Limit</h4>
            {rateLimitStatus ? (
              <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px]">Messages Used</span>
                  <span className={`text-sm font-bold ${rateLimitStatus.canChat ? 'text-green-400' : 'text-red-400'}`}>
                    {rateLimitStatus.messagesUsed}/3
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${rateLimitStatus.canChat ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${(rateLimitStatus.messagesUsed / 3) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[9px] text-gray-400">
                  {rateLimitStatus.canChat 
                    ? `${rateLimitStatus.messagesRemaining} message${rateLimitStatus.messagesRemaining !== 1 ? 's' : ''} remaining today` 
                    : 'Limit reached. Try again tomorrow'}
                </p>
                <p className="text-[9px] text-gray-500 mt-1">
                  Reset: {new Date(rateLimitStatus.resetTime).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <div className="text-[10px] text-gray-400">Loading rate limit...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
