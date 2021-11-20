import React from "react";
import { useNavigate } from "react-router";
import { createBrowserHistory } from "history";
import { useVideoCall } from "../services/VideoCallService";

const Calling = ({ name, uid, rejected }) => {
  const navigate = useNavigate();

  const history = createBrowserHistory();

  const { rejectCall } = useVideoCall();

  // const navigateToMeet = () => {
  //   history.push(window.location.pathname);
  //   navigate(`/meet?acceptCall=${uid}`);
  // };

  return (
    <div className="justify-center backdrop-brightness-75 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative w-auto my-6 mx-auto max-w-3xl">
        <div className="border-0 animate-pulseSlow p-8 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          {!rejected ? <h1 className="text-2xl font-bold text-gray-800">Calling {name} ...</h1> : <h1 className="text-2xl font-bold text-gray-800">Call Rejected</h1>}
          <div className="flex mt-4  w-full gap-4">
            <button className="px-4 flex items-center rounded-md flex-1 py-2 text-gray-200 bg-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calling;
