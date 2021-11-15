import React from "react";

function LeftPane({ onSelect, usersList, loading }) {
  return (
    <>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <div className="bg-gray-100 w-1/4 flex flex-col divide-y-2">
          {usersList.map((user) => (
            <div
              className="bg-gray-100 py-2 px-2  hover:bg-gray-200 cursor-pointer active:scale-95"
              onClick={() => onSelect(user)}
            >
              <div className="flex items-center justify-between">
                {user.uname}
                {/* <p className="w-2 h-2 rounded-full bg-green-500"></p> */}
                <p className="w-2 h-2 rounded-full bg-red-500"></p>
              </div>
              <p className="text-sm text-gray-600">How are you</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default LeftPane;
