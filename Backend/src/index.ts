import app from "./app";
import {port} from "./app/config/config";
import { dbcontext } from "./app/context/context";
import { io, socketserver } from "./socket/socketServer";

/* Server Config */
const server = socketserver.listen(port||4000, () => {
  console.log(`App Running on port ${port}`);
});

//db connection
dbcontext()
// Handling unhandled promise rejection
process.on('unhandledRejection',()=>{
  console.log('UnhandleRejection is detected, shutting the server')
  if(server){
    server.close(()=>{
      process.exit(1)
    })
  }
  process.exit(1)
})


//handling uncaught exceptions
process.on('uncaughtException',()=>{
  console.log('UncaughtException is detected, shutting the server')
  process.exit(1)
})


//Handling warning 
process.on('warning',(warn)=>{
  console.log(`WARNING: ${warn.message}`)
  
})