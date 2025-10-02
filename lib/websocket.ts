type WebSocketMessage = {
  type:
    | "project_update"
    | "task_update"
    | "task_create"
    | "task_delete"
    | "user_activity";
  payload: any;
  timestamp: number;
  userId: string;
};

type WebSocketCallback = (message: WebSocketMessage) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private callbacks: Set<WebSocketCallback> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    // In production, this would be a real WebSocket server
    // For demo purposes, we'll simulate WebSocket behavior
    console.log(
      "[Seif] WebSocket: Simulating connection with token:",
      token.substring(0, 10) + "..."
    );

    // Simulate connection delay
    setTimeout(() => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      console.log("[Seif] WebSocket: Connected successfully (simulated)");

      // Simulate receiving messages periodically
      this.simulateMessages();
    }, 500);
  }

  private simulateMessages() {
    // Simulate receiving activity updates every 10 seconds
    setInterval(() => {
      const message: WebSocketMessage = {
        type: "user_activity",
        payload: {
          action: "viewing",
          resource: "project",
          resourceId: Math.floor(Math.random() * 5) + 1,
        },
        timestamp: Date.now(),
        userId: "simulated-user",
      };
      this.notifyCallbacks(message);
    }, 10000);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    console.log("[Seif] WebSocket: Disconnected");
  }

  subscribe(callback: WebSocketCallback) {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  send(message: WebSocketMessage) {
    // In a real implementation, this would send to the server
    console.log("[Seif] WebSocket: Sending message", message);

    // Simulate server echo back
    setTimeout(() => {
      this.notifyCallbacks(message);
    }, 100);
  }

  private notifyCallbacks(message: WebSocketMessage) {
    this.callbacks.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        console.error("[Seif] WebSocket: Error in callback", error);
      }
    });
  }
}

export const wsManager = new WebSocketManager();
export type { WebSocketMessage };
