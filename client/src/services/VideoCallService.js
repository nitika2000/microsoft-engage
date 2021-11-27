import React, {
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { io as SocketIo } from "socket.io-client";
import Peer from "simple-peer";
import { useAuth } from "../Components/AuthContext";
import IncomingCall from "../Components/IncomingCall";
import { createBrowserHistory } from "history";
import Calling from "../Components/Calling";
import { useNavigate } from "react-router";

const VideoCallContext = React.createContext();

export function useVideoCall() {
  return useContext(VideoCallContext);
}

export function VideoCallProvider({ children }) {
  const { currentUserData } = useAuth();
  const io = useMemo(
    () =>
      SocketIo("https://protected-oasis-07887.herokuapp.com/", {
        autoConnect: false,
      }),
    [],
  );

  const history = createBrowserHistory();

  const navigate = useNavigate();

  const [incomingCall, setIncomingCall] = useState(null);
  const [ongoingCall, setOngoingCall] = useState(false);
  const [outgoingCall, setOutgoingCall] = useState(null);
  const [cancellingCall, setCancellingCall] = useState(false);
  const [callId, setCallId] = useState(null);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerRef = useRef(null);
  const [startCleanup, setStartCleanup] = useState(false);

  useEffect(() => {
    if (!currentUserData) {
      return;
    }
    io.auth = { uid: currentUserData.uid, name: currentUserData.uname };
    io.connect();
    io.on("call-rejected", (data) => {
      setCallId(null);
      setOngoingCall(false);
      setIncomingCall(null);
      setOutgoingCall((outgoingCall) => ({ ...outgoingCall, rejected: true }));
      setTimeout(() => {
        setStartCleanup(true);
      }, 1000);
    });
    io.on("call-cancelled", (data) => {
      setCallId(null);
      setOngoingCall(false);
      setIncomingCall(null);
      setOutgoingCall(null);
      setCancellingCall(false);
      setTimeout(() => {
        setStartCleanup(true);
      }, 1000);
    });
    io.on("incoming-call", (data) => {
      setIncomingCall({
        from: data.from,
        callId: data.callId,
        signalData: data.signalData,
      });
      setCallId(data.callId);
    });
    io.on("call-accepted", (data) => {
      if (peerRef.current) {
        setOngoingCall(true);
        peerRef.current.signal(data.signalData);
        navigate(`/meet/${callId}`);
      }
    });
    io.on("call-ended", (data) => {
      setCallId(null);
      setOngoingCall(false);
      setIncomingCall(null);
      setOutgoingCall(null);
      setTimeout(() => {
        setStartCleanup(true);
      }, 1000);
    });
    return () => {
      io.off("call-rejected");
      io.off("incoming-call");
      io.off("call-accepted");
      io.off("call-ended");
      io.off("call-cancelled");
    };
  }, [io, currentUserData, peerRef, callId, navigate]);

  useEffect(() => {
    if (startCleanup) {
      setIncomingCall(null);
      setOngoingCall(false);
      setCallId(null);
      setRemoteStream(null);
      setStartCleanup(false);
      setOutgoingCall(null);
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
    return window.navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  };

  const callUser = async (userId, userName) => {
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
          setOutgoingCall({ callId: response.callId, name: userName });
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
      io.emit("accept-call", {
        from: incomingCall.from.uid,
        signalData: signalData,
        callId: callId,
      });
    });

    peer.signal(incomingCall.signalData);

    peer.on("stream", (remoteStream) => {
      setOngoingCall(true);
      setRemoteStream(remoteStream);
    });

    peerRef.current = peer;

    navigate(`/meet/${callId}`);
  };

  const rejectCall = () => {
    io.emit("reject-call", { callId: callId, rejectedBy: currentUserData.uid });
    setCallId(null);
    setIncomingCall(null);
    setOngoingCall(false);
  };

  const endCall = () => {
    io.emit("end-call", { callId: callId });
  };

  const cancelCall = () => {
    setCancellingCall(true);
    io.emit("cancel-call", { callId: callId });
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
    rejectCall,
    cancelCall,
  };

  return (
    <VideoCallContext.Provider value={value}>
      {children}
      {incomingCall && !ongoingCall ? (
        <IncomingCall
          name={incomingCall?.from.name || "bhutni"}
          uid={incomingCall?.from.uid || "fsdafsa"}
        />
      ) : null}
      {outgoingCall && !ongoingCall ? (
        <Calling
          name={outgoingCall.name}
          rejected={outgoingCall.rejected}
          cancellingCall={cancellingCall}
        />
      ) : null}
    </VideoCallContext.Provider>
  );
}
