import { addDoc, collection, Timestamp, doc, setDoc } from "@firebase/firestore";
import React from "react";
import db from "../../services/firebase-config";
import { useAuth } from "../AuthContext";
import MainView from "./MainView";
import MessageForm from "./MessageForm";
import { useState } from "react";
import { getMessageId } from "../../services/helper";

function ChatView({ selectedUser, onBackClick }) {
  const [text, setText] = useState("");
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputText = text;
    console.log(inputText, text);
    setText("");
    console.log(inputText, text);

    const msgId = getMessageId(currentUser, selectedUser);

    await addDoc(collection(db, "messages", msgId, "chats"), {
      text: inputText,
      from: currentUser.uid,
      to: selectedUser.uid,
      createdAt: Timestamp.fromDate(new Date()),
      unread: true,
    });

    await setDoc(doc(db, "lastMsgs", msgId), {
      text: inputText,
      from: currentUser.uid,
      to: selectedUser.uid,
      createdAt: Timestamp.fromDate(new Date()),
      unread: true,
    });
  };

  return (
    <div className="flex h-full flex-col justify-between ">
      {selectedUser ? (
        <>
          <div className="bg-gray-200 py-2 px-4 flex items-center gap-2">
            <button className="inline-block md:hidden" onClick={onBackClick}>
              <i class="text-2xl fas fa-arrow-left"></i>
            </button>
            <div>
              <h1 className="text-xl">{selectedUser.uname}</h1>
              <p className="text-gray-400 text-sm">Online</p>
            </div>
          </div>
          <MainView selectedUser={selectedUser} />
          <MessageForm text={text} setText={setText} handleSubmit={handleSubmit} />
        </>
      ) : (
        <div>Select user to start chat</div>
      )}
    </div>
  );
}

export default ChatView;
