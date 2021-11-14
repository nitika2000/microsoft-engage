import React from "react";
import { useAuth } from "../Components/AuthContext";
import LeftPane from "../Components/Chats/LeftPane";
import { useState } from "react";
import ChatView from "../Components/Chats/ChatView";

function Dashboard() {
  const { currentUser } = useAuth();
  const [selectedUser, setselectedUser] = useState();

  const onSelect = (user) => {
    setselectedUser(user);
  };

  return (
    <div>
      <LeftPane onSelect={onSelect} />
      {selectedUser ? <ChatView selectedUser={selectedUser} /> : null}
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
