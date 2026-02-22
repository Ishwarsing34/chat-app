import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

console.log("🚀 WebSocket server running on ws://localhost:8080");


const rooms = new Map<string, Set<WebSocket>>();

wss.on("connection", (socket: WebSocket) => {
  console.log("✅ New client connected");

  socket.on("message", (rawMessage: Buffer) => {
    try {
      const message = JSON.parse(rawMessage.toString());

      if (!message.type) return;

      // ===============================
      // JOIN ROOM
      // ===============================
      if (message.type === "join") {
        const roomId = message.payload?.roomId;
        if (!roomId) return;

        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }

        rooms.get(roomId)?.add(socket);

        console.log(`👤 User joined room: ${roomId}`);
      }

      // ===============================
      // CHAT MESSAGE
      // ===============================
      if (message.type === "chat") {
        const roomId = message.payload?.roomId;
        const chatMessage = message.payload?.message;

        if (!roomId || !chatMessage) return;

        const room = rooms.get(roomId);
        if (!room) return;

        console.log(`💬 Message in ${roomId}: ${chatMessage}`);

        room.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
             
                message: chatMessage,
              })
            );
          }
        });
      }
    } catch (error) {
      console.log("❌ Invalid JSON received");
    }
  });

  // ===============================
  // HANDLE DISCONNECT
  // ===============================
  socket.on("close", () => {
    console.log("❌ Client disconnected");

    rooms.forEach((clients, roomId) => {
      clients.delete(socket);

  
      if (clients.size === 0) {
        rooms.delete(roomId);
      }
    });
  });
});