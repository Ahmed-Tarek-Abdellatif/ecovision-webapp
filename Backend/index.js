import express from "express";
import bootstrap from "./src/app.controller.js";
import dotenv from "dotenv";
import morgan from "morgan"
import chalk from "chalk"

dotenv.config();
const app=express()
// app.use(morgan("combined"))

bootstrap(app,express);


const port= 3000;
const server = app.listen(port, () => {
    console.log("Server running on port 3000");
  });
  
  process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
  