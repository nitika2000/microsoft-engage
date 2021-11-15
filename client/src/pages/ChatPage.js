import React from "react";
import { useAuth } from "../Components/AuthContext";
import { useState, useEffect } from "react";
import { collection, where, query, onSnapshot } from "@firebase/firestore";
import db from "../services/firebase-config";
import LeftPane from "../Components/Chats/LeftPane";
import ChatView from "../Components/Chats/ChatView";

function ChatPage() {
  const { currentUser } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [leftPaneLoading, setLeftPaneLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState();

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

  const onUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-[80vh] inset-0 container mx-auto shadow-md border p-4 gap-4 mt-8 divide-x-2 ">
      <LeftPane
        onSelect={onUserSelect}
        usersList={usersList}
        loading={leftPaneLoading}
      />
      <ChatView selectedUser={selectedUser} />
    </div>
  );
}

export default ChatPage;
