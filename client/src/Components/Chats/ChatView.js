import { addDoc, collection, Timestamp } from "@firebase/firestore";
import React from "react";
import db from "../../services/firebase-config";
import { useAuth } from "../AuthContext";
import MainView from "./MainView";
import MessageForm from "./MessageForm";
import { useState } from "react";

function ChatView({ selectedUser }) {
  const [text, setText] = useState("");
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user2 = selectedUser.uid;
    const user1 = currentUser.uid;
    setText("");
    const msgId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    await addDoc(collection(db, "messages", msgId, "chats"), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  return (
    <div className="w-3/4 pl-4 flex flex-col justify-between ">
      {selectedUser ? (
        <>
          <h1 className="bg-gray-200 py-2 px-4">{selectedUser.uname}</h1>
          <MainView selectedUser={selectedUser} />
          <MessageForm handleSubmit={handleSubmit} text={text} setText={setText} />{" "}
        </>
      ) : (
        <div>Select user to start chat</div>
      )}
    </div>
  );
}

export default ChatView;
