import React from "react";
import UserCard from "./UserCard";

function LeftPane({ onSelect, usersList, loading }) {
  return (
    <>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <div className="bg-gray-100 w-1/4 flex flex-col divide-y-2">
          {usersList.map((user) => (
            <UserCard onSelect={onSelect} user={user} key={user.uid} />
          ))}
        </div>
      )}
    </>
  );
}

export default LeftPane;
