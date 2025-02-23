import { Server } from "socket.io";
import { frontend_url } from "../app/config/config";
import app from "../app";
import http from "http";

const socketserver = http.createServer(app);

// Create a map to store user-socket associations
const userSocketMap = new Map<string, string>();
console.log(userSocketMap)
/* Integrate Socket.IO with the same HTTP server as Express */
const io = new Server(socketserver, {
    cors:{origin:[`${frontend_url}`]}
  });
  
  /* Socket.IO logic */
  io.on('connection', (socket) => {
    console.log('a user connected' + "socket id: " + socket.id);
    
    // Join user to their room and store the mapping
    socket.on('join', ({ userId }) => {
      if (userId) {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} mapped to socket ${socket.id}`);
      }
    });

    socket.on('disconnect', () => {
      // Remove user from map when they disconnect
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`User ${userId} disconnected and removed from map`);
          break;
        }
      }
    });
  });

  export {io, socketserver, userSocketMap};