import React from "react";
import { useState } from "react";
import LeftPane from "../Components/Chats/LeftPane";
import ChatView from "../Components/Chats/ChatView";

function ChatPage() {
  const [selectedUser, setSelectedUser] = useState();

  const onUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-[80vh] inset-0 container mx-auto shadow-md border p-4 gap-4 mt-8 divide-x-2 ">
      <LeftPane onSelect={onUserSelect} />
      <ChatView selectedUser={selectedUser} />
    </div>
  );
}

export default ChatPage;
