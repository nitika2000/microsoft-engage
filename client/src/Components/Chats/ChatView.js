import React from "react";
import MainView from "./MainView";

function ChatView({ selectedUser }) {
  return (
    <div>
      this is selected {selectedUser.uname}
      <MainView selectedUser={selectedUser} />
    </div>
  );
}

export default ChatView;
