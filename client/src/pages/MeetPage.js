import React, { useState } from "react";
import Video from "../Components/Video";
import { useAuth } from "../Components/AuthContext";
import { useVideoCall } from "../services/VideoCallService";

const MeetPage = () => {
  const [id, setId] = useState("");

  const { callUser, stream, remoteStream, callId, endCall } = useVideoCall();

  const { currentUser } = useAuth();

  return (
    <div>
      <form>
        <input
          type="text"
          className="form-input"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button type="button" onClick={() => callUser(id)}>
          Call
        </button>
        <p className="font-bold text-2xl">{currentUser.uid}</p>
      </form>
      <div className="flex flex-row mx-auto w-full">
        <Video stream={stream} muted={true} />
        <Video stream={remoteStream} />
      </div>
      <p>Call id {callId}</p>
      <button className="px-4 py-2 bg-red-500" onClick={endCall}>
        End
      </button>
    </div>
  );
};

export default MeetPage;
