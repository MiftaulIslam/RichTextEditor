import app from "./app";
import AppConfig from "./app/config/config";

import {Server} from 'http'
import { dbcontext } from "./app/context/context";


/* Server Config */
const { port } = AppConfig;
const server:Server = app.listen(port||4000, () => {
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