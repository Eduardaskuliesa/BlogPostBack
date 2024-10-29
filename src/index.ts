import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config/config";
import { Request, Response } from "express";
import authorRoutes from './routes/authorRoutes'
//CONFIGURATIONS
const server = express();
server.use(express.json());
server.use(morgan("tiny"));
server.use(helmet());
server.use(cors());
server.use(express.static("public"));

//ROUTES
server.use('/api/', authorRoutes);


//SERVER
server.listen(config.server.port, () => {
  console.log(
    `server is running on: http://${config.server.domain}:${config.server.port}`
  );
});
