import { collection, query, orderBy, onSnapshot } from "@firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import db from "../../services/firebase-config";
import { useAuth } from "../AuthContext";

function MainView({ selectedUser }) {
  const { currentUser } = useAuth();
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    const user1 = currentUser.uid;
    const user2 = selectedUser.uid;
    console.log(user1, user2);
    const msgId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, "messages", msgId, "chats");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
    return () => unsub();
  }, [selectedUser.uid]);

  return (
    <div>
      <h1>These are messages </h1>
      {msgs.map((msg) => (
        <div>{msg.text}</div>
      ))}
    </div>
  );
}

export default MainView;
