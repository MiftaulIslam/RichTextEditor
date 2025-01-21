import { Server } from "socket.io";
import { frontend_url } from "../app/config/config";

/* Integrate Socket.IO with the same HTTP server as Express */
const io = new Server(3000,{
    cors:{origin:[`${frontend_url}`]}
  });
  
  /* Socket.IO logic */
  io.on('connection', (socket) => {
    console.log('a user connected' + "socket id: " + socket.id);
    
    // Join user to their room
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  export {io};