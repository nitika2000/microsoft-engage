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
    <div className="flex h-[80vh] inset-0 container mx-auto shadow-md p-4 gap-4 mt-8 divide-x-2 ">
      <LeftPane onSelect={onSelect} />
      <ChatView selectedUser={selectedUser} />
    </div>
  );
}

export default Dashboard;
