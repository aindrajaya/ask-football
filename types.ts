export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  isBot?: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: User;
  timestamp: number;
  channel: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
}

export enum PubSubEvent {
  MESSAGE = 'MESSAGE',
  TYPING = 'TYPING',
}

export interface PubSubPayload {
  type: PubSubEvent;
  payload: any;
}
