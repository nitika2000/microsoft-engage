import React from "react";
import { useAuth } from "../Components/AuthContext";
import { useState, useEffect } from "react";
import { collection, where, query, onSnapshot, addDoc, Timestamp, orderBy, setDoc, doc, getDoc, updateDoc } from "@firebase/firestore";
import db from "../services/firebase-config";
import MainView from "../Components/Chats/MainView";
import LeftPane from "../Components/Chats/LeftPane";
import MessageForm from "../Components/Chats/MessageForm";
import ChatView from "../Components/Chats/ChatView";

function ChatPage() {
  const { currentUser } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [leftPaneLoading, setLeftPaneLoading] = useState(true);
  const [msgViewLoading, setMsgViewLoading] = useState(true);
  const [msgs, setMsgs] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedUser, setSelectedUser] = useState();
  const [msgListener, setMsgListener] = useState();

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [currentUser.uid]));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsersList(users);
      setLeftPaneLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);

  const getMessageId = (currentUser, selectedUser) => {
    console.log(currentUser, selectedUser);
    const user1 = currentUser.uid;
    const user2 = selectedUser.uid;

    const msgId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    return msgId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = inputText;
    setInputText("");
    const msgId = getMessageId(currentUser, selectedUser);

    await addDoc(collection(db, "messages", msgId, "chats"), {
      text,
      from: currentUser.uid,
      to: selectedUser.uid,
      createdAt: Timestamp.fromDate(new Date()),
      unread: true,
    });

    await setDoc(doc(db, "lastMsgs", msgId), {
      text,
      from: currentUser.uid,
      to: selectedUser.uid,
      createdAt: Timestamp.fromDate(new Date()),
      unread: true,
    });
  };

  const updateLastMsg = async (msgId) => {
    const lastMsgSnap = await getDoc(doc(db, "lastMsgs", msgId));
    if (lastMsgSnap.data() && lastMsgSnap.data().to === currentUser.uid) {
      // await updateDoc(doc(db, "lastMsgs", lastMsgSnap), {
      //   unread: false,
      // });
    }
  };

  useEffect(() => {
    if (selectedUser) {
      const msgId = getMessageId(currentUser, selectedUser);
      const msgsRef = collection(db, "messages", msgId, "chats");
      const q = query(msgsRef, orderBy("createdAt", "asc"));

      const unsub = onSnapshot(q, (querySnapshot) => {
        let msgs = [];
        querySnapshot.forEach(async (msgDoc) => {
          if (msgDoc.data().to === currentUser.uid && msgDoc.data().unread === true) {
            await updateDoc(msgDoc.ref, { unread: false });
          }
          msgs.push(msgDoc.data());
        });
        setMsgs(msgs);
        setMsgViewLoading(false);
      });

      updateLastMsg(msgId);
      return unsub;
    }
  }, [selectedUser]);

  const onUserSelect = (user) => {
    setSelectedUser(user);
  };

  console.log("messages", msgs);
  return (
    // <div>
    //   <div>
    //     <LeftPane
    //       onUserSelect={onUserSelect}
    //       loading={leftPaneLoading}
    //       usersList={usersList}
    //     />
    //   </div>

    //   <div>
    //     {selectedUser ? (
    //       <MainView msgs={msgs} loading={msgViewLoading} />
    //     ) : (
    //       <h1>Please select</h1>
    //     )}
    //   </div>
    //   <MessageForm
    //     handleSubmit={handleSubmit}
    //     text={inputText}
    //     setText={setInputText}
    //   />
    // </div>
    <div className="flex h-[80vh] inset-0 container mx-auto shadow-md border p-4 gap-4 mt-8 divide-x-2 ">
      <LeftPane onSelect={onUserSelect} usersList={usersList} loading={leftPaneLoading} />
      <ChatView selectedUser={selectedUser} />
    </div>
  );
}

export default ChatPage;
