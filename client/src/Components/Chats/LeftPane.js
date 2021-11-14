import React from "react";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import db from "../../services/firebase-config";

function LeftPane({ onSelect }) {
  const { currentUser } = useAuth();
  const [userList, setuserList] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [currentUser.uid]));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setuserList(users);
    });
    return () => unsub();
  }, []);

  console.log(userList);

  return (
    <div>
      {userList.map((user) => (
        <div onClick={() => onSelect(user)}>{user.uname}</div>
      ))}
    </div>
  );
}

export default LeftPane;
