import React from "react";
import { useNavigate } from "react-router";
import { createBrowserHistory } from "history";

const IncomingCall = ({ name, uid }) => {
  const navigate = useNavigate();

  const history = createBrowserHistory();

  const navigateToMeet = () => {
    history.push(window.location.pathname);
    navigate(`/meet?acceptCall=${uid}`);
  };

  return (
    <div className="justify-center backdrop-brightness-75 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative w-auto my-6 mx-auto max-w-3xl">
        <div className="border-0 animate-pulseSlow p-8 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <h1 className="text-2xl font-bold text-gray-800">Piyush Bhutani is calling...</h1>
          <div className="flex mt-4  w-full gap-4">
            <button className="px-4 rounded-md flex items-center text-gray-200 flex-1 py-2 bg-green-700" onClick={navigateToMeet}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 3l-6 6m0 0V4m0 5h5M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                />
              </svg>
              Accept
            </button>
            <button className="px-4 flex items-center rounded-md flex-1 py-2 text-gray-200 bg-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
