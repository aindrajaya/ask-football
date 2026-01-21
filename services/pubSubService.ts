import { PubSubPayload } from '../types';

/**
 * A robust Publisher-Subscriber service.
 * In a production environment, this would be replaced by the PubNub SDK or a WebSocket implementation.
 * Here, we use the BroadcastChannel API which allows communication between different tabs/windows
 * on the same origin, perfectly simulating a real-time server environment for a demo.
 */
class PubSubService {
  private channels: Map<string, BroadcastChannel> = new Map();
  private listeners: Map<string, Set<(data: PubSubPayload) => void>> = new Map();

  /**
   * Subscribes to a specific channel.
   * @param channelName The ID/Name of the channel
   * @param callback The function to call when a message is received
   * @returns A cleanup function to unsubscribe
   */
  public subscribe(channelName: string, callback: (data: PubSubPayload) => void): () => void {
    // 1. Initialize BroadcastChannel if not exists
    if (!this.channels.has(channelName)) {
      const bc = new BroadcastChannel(channelName);
      bc.onmessage = (event) => {
        this.notifyListeners(channelName, event.data);
      };
      this.channels.set(channelName, bc);
    }

    // 2. Register local listener
    if (!this.listeners.has(channelName)) {
      this.listeners.set(channelName, new Set());
    }
    this.listeners.get(channelName)?.add(callback);

    // 3. Return unsubscribe closure
    return () => {
      const channelListeners = this.listeners.get(channelName);
      if (channelListeners) {
        channelListeners.delete(callback);
        // If no listeners left, we could optionally close the BroadcastChannel
        // allowing it to stay open for simplicity in this demo
      }
    };
  }

  /**
   * Publishes a message to a channel.
   * @param channelName The ID/Name of the channel
   * @param data The payload to send
   */
  public publish(channelName: string, data: PubSubPayload): void {
    // 1. Send to external listeners (other tabs) via BroadcastChannel
    if (!this.channels.has(channelName)) {
      this.channels.set(channelName, new BroadcastChannel(channelName));
    }
    this.channels.get(channelName)?.postMessage(data);

    // 2. Send to internal listeners (this tab)
    // BroadcastChannel does NOT fire onmessage for the tab that sent it, so we must manually notify.
    this.notifyListeners(channelName, data);
  }

  private notifyListeners(channelName: string, data: PubSubPayload) {
    const channelListeners = this.listeners.get(channelName);
    if (channelListeners) {
      channelListeners.forEach(listener => listener(data));
    }
  }
}

// Singleton instance
export const pubSub = new PubSubService();
