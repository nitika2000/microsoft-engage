import React, { useContext, useState, useMemo, useEffect, useCallback, useRef } from "react";
import { io as SocketIo } from "socket.io-client";
import Peer from "simple-peer";
import { useAuth } from "../Components/AuthContext";
import IncomingCall from "../Components/IncomingCall";
import { createBrowserHistory } from "history";

const VideoCallContext = React.createContext();

export function useVideoCall() {
  return useContext(VideoCallContext);
}

export function VideoCallProvider({ children }) {
  const { currentUserData } = useAuth();
  const io = useMemo(() => SocketIo("http://localhost:5000", { autoConnect: false }), []);

  const history = createBrowserHistory();

  console.log(history);

  const [incomingCall, setIncomingCall] = useState(null);
  const [ongoingCall, setOngoingCall] = useState(false);
  const [callId, setCallId] = useState(null);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerRef = useRef(null);
  const [startCleanup, setStartCleanup] = useState(false);

  useEffect(() => {
    if (!currentUserData) {
      return;
    }
    console.log("called use effect");
    io.auth = { uid: currentUserData.uid, name: currentUserData.uname };
    io.connect();
    io.on("call-rejected", (data) => {
      setCallId(null);
      setOngoingCall(false);
      setIncomingCall(null);
    });
    io.on("incoming-call", (data) => {
      setIncomingCall({ from: data.from, callId: data.callId, signalData: data.signalData });
      setCallId(data.callId);
    });
    io.on("call-accepted", (data) => {
      if (peerRef.current) {
        setOngoingCall(true);
        peerRef.current.signal(data.signalData);
      }
    });
    io.on("call-ended", (data) => {
      setStartCleanup(true);
    });
    return () => {
      io.off("call-rejected");
      io.off("incoming-call");
      io.off("call-accepted");
    };
  }, [io, currentUserData, peerRef]);

  useEffect(() => {
    if (startCleanup && stream) {
      setIncomingCall(null);
      setOngoingCall(false);
      setCallId(null);
      setRemoteStream(null);
      setStartCleanup(false);
      if (stream) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      setTimeout(() => {
        setStream(null);
        history.back();
      }, 2000);
    }
  }, [startCleanup, peerRef, stream, history]);

  const requestVideoAudio = async () => {
    return window.navigator.mediaDevices.getUserMedia({ video: true });
  };

  const callUser = async (userId) => {
    const stream = await requestVideoAudio();
    setStream(stream);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (signalData) => {
      const payload = {
        from: { name: currentUserData.uname, uid: currentUserData.uid },
        to: userId,
        signalData: signalData,
      };
      io.emit("call-user", payload, (response) => {
        if (response.ok) {
          setCallId(response.callId);
        }
      });
    });

    peer.on("stream", (remoteStream) => {
      setRemoteStream(remoteStream);
    });

    peerRef.current = peer;
  };

  const receiveCall = async () => {
    const stream = await requestVideoAudio();
    setStream(stream);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (signalData) => {
      io.emit("accept-call", { from: incomingCall.from.uid, signalData: signalData, callId: callId });
    });

    peer.signal(incomingCall.signalData);

    peer.on("stream", (remoteStream) => {
      setOngoingCall(true);
      setRemoteStream(remoteStream);
    });

    peerRef.current = peer;
  };

  const endCall = () => {
    console.log("my stream", stream, peerRef);
    io.emit("end-call", { callId: callId });
  };

  const value = {
    callUser,
    receiveCall,
    stream,
    remoteStream,
    incomingCall,
    ongoingCall,
    callId,
    endCall,
  };

  return (
    <VideoCallContext.Provider value={value}>
      {children}
      {incomingCall && !ongoingCall ? <IncomingCall name={incomingCall?.from.name || "bhutni"} uid={incomingCall?.from.uid || "fsdafsa"} /> : null}
    </VideoCallContext.Provider>
  );
}
