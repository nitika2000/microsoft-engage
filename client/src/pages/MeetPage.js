import React, { useState } from "react";
import Video from "../Components/Video";
import { useAuth } from "../Components/AuthContext";
import { useVideoCall } from "../services/VideoCallService";

const MeetPage = () => {
  const [id, setId] = useState("");

  const { callUser, stream, remoteStream, callId, endCall } = useVideoCall();

  const { currentUser } = useAuth();

  return (
    <div className="bg-gray-200">
      <div className="flex bg-gray-200 flex-row justify-center m-auto">
        <div className="flex=1 h-full p-4">
          <Video stream={stream} muted={true} />
        </div>
        <div className="flex=1 p-4 h-full">
          <Video stream={remoteStream} />
        </div>
      </div>
      <div className="flex ">
        <button
          onClick={endCall}
          className="bg-red-500 m-auto font-semibold text-white py-2 px-4 border-transparent rounded"
          type="button"
        >
          End
        </button>
      </div>
    </div>
  );
};

export default MeetPage;
