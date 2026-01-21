import React from 'react';
import { Channel } from '../types';

interface ChannelListProps {
  channels: Channel[];
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
}

export const ChannelList: React.FC<ChannelListProps> = ({ channels, activeChannelId, onSelectChannel }) => {
  return (
    <div className="w-64 bg-gray-800 flex-shrink-0 flex flex-col border-r border-gray-700 h-full">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="text-blue-500">◆</span> PubSub Chat
        </h1>
        <p className="text-xs text-gray-400 mt-1">Simulated via BroadcastChannel</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Channels
        </div>
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onSelectChannel(channel.id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-3 ${
              activeChannelId === channel.id
                ? 'bg-blue-600/20 text-blue-200'
                : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            <span className="text-lg opacity-60">#</span>
            <span className="font-medium truncate">{channel.name}</span>
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-900/50 border-t border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Connected
        </div>
      </div>
    </div>
  );
};
