import { addDoc, collection, Timestamp, doc, setDoc } from "@firebase/firestore";
import React, { useEffect } from "react";
import db from "../../services/firebase-config";
import { useAuth } from "../AuthContext";
import MainView from "./MainView";
import MessageForm from "./MessageForm";
import { useState } from "react";
import { getMessageId } from "../../services/helper";
import Avatar from "./Avatar";
import { useNavigate } from "react-router";

function ChatView({ selectedUser, onBackClick, isClassroom }) {
  const [text, setText] = useState("");
  const { currentUser, currentUserData } = useAuth();
  const [taggedMsg, setTaggedMsg] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTaggedMsg(null);
  }, [selectedUser]);

  const handleSubmit = async (filesUploaded) => {
    const inputText = text;
    setText("");
    const tempTaggedMsg = taggedMsg;
    const msgId = isClassroom ? selectedUser.uid : getMessageId(currentUser, selectedUser);
    setTaggedMsg(null);
    await addDoc(collection(db, "messages", msgId, "chats"), {
      text: inputText,
      from: currentUser.uid,
      to: selectedUser.uid,
      createdAt: Timestamp.fromDate(new Date()),
      attachments: filesUploaded,
      unread: true,
      taggedMsg: tempTaggedMsg,
      senderName: currentUserData.uname,
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

  const handleCallClick = () => {
    navigate(`/meet?callUser=${selectedUser.uid}`);
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
              <p className="text-gray-500 text-sm">{selectedUser.isOnline ? "Online" : "Down"}</p>
            </div>
            <button onClick={handleCallClick} className="bg-blue-500 px-8 shadow-sm py-1 hover:opacity-80 active:scale-95 text-white font-bold ml-auto rounded-sm">
              Call
            </button>
          </div>
          <MainView selectedUser={selectedUser} taggedMsg={taggedMsg} onMsgTag={handleMsgTag} isClassroom={isClassroom} />
          <MessageForm text={text} setText={setText} handleSubmit={handleSubmit} isClassroom={isClassroom} />
        </>
      ) : (
        <div>Select User/Classroom to start chat</div>
      )}
    </div>
  );
}

export default ChatView;
