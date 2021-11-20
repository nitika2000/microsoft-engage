import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config();

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS || "";

const firebaseApp = initializeApp({
  credential: applicationDefault(),
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
});

const firestore = getFirestore(firebaseApp);

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

const ongoingCalls: {
  [key: string]: any[];
} = {};

const rooms: {
  [key: string]: string[];
} = {};

io.use((socket, next) => {
  const uid = socket.handshake.auth.uid;
  if (!uid) {
    throw Error("user must provide uid to connect");
  }
  socket.data.uid = uid;
  next();
});

io.on("connection", (socket) => {
  console.log("user connected with", socket.data.uid);
  firestore
    .doc(`users/${socket.data.uid}`)
    .set({ isOnline: true }, { merge: true })
    .then()
    .catch((err) => console.log(err));

  socket.on("disconnect", () => {
    firestore
      .doc(`users/${socket.data.uid}`)
      .set({ isOnline: false, lastSeen: new Date() }, { merge: true })
      .then()
      .catch((err) => console.log(err));
  });

  socket.on("peer-connected", (id) => {
    console.log("peer connected with", id);
    socket.broadcast.emit("peer-joined", id);
  });

  socket.on("room:request", (id, callback) => {
    const roomId = nanoid(6);
    rooms[roomId] = [id];
    socket.join(roomId);
    callback({ status: "OK", roomId: roomId });
  });

  socket.on("accept-call", (data) => {
    const from = data.from;
    const signalData = data.signalData;
    const callId = data.callId;
    firestore.doc(`calls/${callId}`).set({ callStatus: "accepted" }, { merge: true }).then();
    io.fetchSockets().then((sock) => {
      sock.forEach((conn) => {
        if (conn.data.uid == from) {
          conn.emit("call-accepted", { signalData: signalData, callId: callId });
        }
      });
    });
  });

  socket.on("end-call", (data) => {
    const callId = data.callId;
    firestore.doc(`calls/${callId}`).set({ callStatus: "ended" }, { merge: true }).then();
    firestore
      .doc(`calls/${callId}`)
      .get()
      .then((doc) => {
        io.fetchSockets().then((sock) => {
          sock.forEach((conn) => {
            if (conn.data.uid == doc.data()?.from || conn.data.uid == doc.data()?.to) {
              conn.emit("call-ended", { callId: callId });
            }
          });
        });
      });
  });

  socket.on("call-user", (data, callback) => {
    const from = data.from;
    const to = data.to;
    const signalData = data.signalData;
    const callId = nanoid(16);
    callback({ ok: true, callId: callId });
    firestore
      .doc(`/calls/${callId}`)
      .set({ callId: callId, from: from.uid, to: to, callStatus: "calling" })
      .then((data) => console.log(data));
    io.fetchSockets().then((sock) => {
      sock.forEach((conn) => {
        if (conn.data.uid == to) {
          conn.emit("incoming-call", { from: from, signalData: signalData, callId: callId });
        }
      });
    });
  });

  socket.on("room:join", (data) => {
    if (rooms[data.roomId]) {
      rooms[data.roomId].push(data.id);
      socket.join(data.roomId);
      io.to(data.roomId).emit("user:joined", data.id);
      console.log(rooms);
    }
  });
});

httpServer.listen(5000, () => {
  console.log("Server listening on Port 5000");
});
