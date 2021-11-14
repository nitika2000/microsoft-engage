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
    const msgsId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, "messages", msgsId, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
  }, []);
  
  console.log(msgs);
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
