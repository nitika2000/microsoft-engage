import React from "react";
import { useAuth } from "../Components/AuthContext";
import LeftPane from "../Components/Chats/LeftPane";

function Dashboard() {
  console.log("this is dashboard");
  return (
    <div>
      <LeftPane />
      {/* This is dashboard.
      {currentUser ? (
        <div> Login user {currentUser.email} </div>
      ) : (
        <div> No user is logged in </div>
      )} */}
    </div>
  );
}

export default Dashboard;
