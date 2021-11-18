import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("user connected with", socket.id);

  socket.on("disconnect", () => {
    console.log("disconendte");
  });
});

httpServer.listen(3000, () => {
  console.log("Server listening on Port 3000");
});
