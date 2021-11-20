import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Video from "../Components/Video";
import { useAuth } from "../Components/AuthContext";
import { useLocation, useNavigate } from "react-router";
import { useVideoCall } from "../services/VideoCallService";

const MeetPage = () => {
  const [id, setId] = useState("");

  const navigate = useNavigate();

  const { receiveCall, callUser, stream, remoteStream, incomingCall, ongoingCall, callId, endCall } = useVideoCall();

  const { currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get("callUser");
    const acceptCall = queryParams.get("acceptCall");
    if (acceptCall) {
      receiveCall();
    } else if (uid) {
      callUser(uid);
    }
  }, []);

  return (
    <div>
      <form>
        <input type="text" className="form-input" value={id} onChange={(e) => setId(e.target.value)} />
        <button type="button" onClick={() => callUser(id)}>
          Call
        </button>
        <p className="font-bold text-2xl">{currentUser.uid}</p>
      </form>

      <Video stream={stream} />

      <h1>dusra</h1>
      <Video stream={remoteStream} />
      <p>Call id {callId}</p>

      <button className="px-4 py-2 bg-red-500" onClick={endCall}>
        End
      </button>
    </div>
  );
};

export default MeetPage;
