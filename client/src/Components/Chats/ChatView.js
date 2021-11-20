import { addDoc, collection, Timestamp, doc, setDoc, query, where, onSnapshot } from "@firebase/firestore";
import React, { useEffect } from "react";
import db from "../../services/firebase-config";
import { useAuth } from "../AuthContext";
import MainView from "./MainView";
import MessageForm from "./MessageForm";
import { useState } from "react";
import { formatDateTime, getMessageId, localTimeFormat } from "../../services/helper";
import Avatar from "./Avatar";
import { useNavigate } from "react-router";
import { createBrowserHistory } from "history";
import { useVideoCall } from "../../services/VideoCallService";

function ChatView({ selectedUser, onBackClick, isClassroom }) {
  const [text, setText] = useState("");
  const { currentUser, currentUserData } = useAuth();
  const [taggedMsg, setTaggedMsg] = useState(null);
  const [online, setOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const { callUser } = useVideoCall();

  const navigate = useNavigate();
  const history = createBrowserHistory();

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
    history.push(`/?selectedUser=${selectedUser.uid}`);
    // navigate(`/meet?callUser=${selectedUser.uid}`);
    callUser(selectedUser.uid, selectedUser.uname);
  };

  useEffect(() => {
    if (selectedUser) {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", selectedUser.uid));

      const unsub = onSnapshot(q, (querySnapshot) => {
        let users = [];
        querySnapshot.forEach((doc) => {
          // if (changes.type === "modified") {
          console.log(doc.data());
          setOnline(doc.data().isOnline);
          setLastSeen(doc.data().lastSeen);
          // }
        });
      });
      return unsub;
    }
  }, [selectedUser]);

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
              <p className="text-gray-500 text-sm">{online ? "Online" : lastSeen ? formatDateTime(lastSeen) : ""}</p>
            </div>
            <button
              disabled={!online}
              onClick={handleCallClick}
              className="disabled:opacity-40 bg-blue-500 px-8 shadow-sm py-1 hover:opacity-80 active:scale-95 text-white font-bold ml-auto rounded-sm"
            >
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
