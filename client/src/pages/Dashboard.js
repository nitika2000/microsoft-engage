import React from "react";
import { useAuth } from "../Components/AuthContext";

function Dashboard() {
  const { currentUser } = useAuth();
  console.log("current is ", currentUser);
  return (
    <div>
      This is dashboard.
      {currentUser ? (
        <div> Login user {currentUser.email} </div>
      ) : (
        <div> No user is logged in </div>
      )}
    </div>
  );
}

export default Dashboard;
