import { addDoc, collection, Timestamp, doc, setDoc } from "@firebase/firestore";
import React, { useEffect } from "react";
import db from "../../services/firebase-config";
import { useAuth } from "../AuthContext";
import MainView from "./MainView";
import MessageForm from "./MessageForm";
import { useState } from "react";
import { getMessageId } from "../../services/helper";
import Avatar from "./Avatar";

function ChatView({ selectedUser, onBackClick }) {
  const [text, setText] = useState("");
  const { currentUser } = useAuth();
  const [taggedMsg, setTaggedMsg] = useState(null);

  useEffect(() => {
    setTaggedMsg(null);
  }, [selectedUser]);

  const handleSubmit = async (filesUploaded) => {
    const inputText = text;
    setText("");
    const tempTaggedMsg = taggedMsg;
    const msgId = getMessageId(currentUser, selectedUser);
    setTaggedMsg(null);
    await addDoc(collection(db, "messages", msgId, "chats"), {
      text: inputText,
      from: currentUser.uid,
      to: selectedUser.uid,
      createdAt: Timestamp.fromDate(new Date()),
      attachments: filesUploaded,
      unread: true,
      taggedMsg: tempTaggedMsg,
    });

    await setDoc(doc(db, "lastMsgs", msgId), {
      text: inputText,
      from: currentUser.uid,
      to: selectedUser.uid,
      createdAt: Timestamp.fromDate(new Date()),
      unread: true,
    });
  };

  const handleMsgTag = (msg) => {
    console.log("tagged", msg);
    setTaggedMsg(msg);
  };

  return (
    <div className="flex h-full flex-col justify-between ">
      {selectedUser ? (
        <>
          <div className="bg-white shadow-sm rounded-md py-4 text-black px-4 flex items-center gap-2">
            <button className="inline-block md:hidden" onClick={onBackClick}>
              <i class="text-2xl fas fa-arrow-left"></i>
            </button>
            <Avatar name={selectedUser.uname} w="w-12" h="h-12" />
            <div>
              <h1 className="text-xl font-bold">{selectedUser.uname}</h1>
              <p className="text-gray-500 text-sm">Online</p>
            </div>
          </div>
          <MainView selectedUser={selectedUser} taggedMsg={taggedMsg} onMsgTag={handleMsgTag} />
          <MessageForm text={text} setText={setText} handleSubmit={handleSubmit} />
        </>
      ) : (
        <div>Select user to start chat</div>
      )}
    </div>
  );
}

export default ChatView;
