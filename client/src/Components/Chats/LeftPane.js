import React from "react";
import { useAuth } from "../AuthContext";
import UserCard from "./UserCard";
import { useState, useEffect } from "react";
import { collection, where, query, onSnapshot } from "@firebase/firestore";
import db from "../../services/firebase-config";

function LeftPane({ onSelect }) {
  const { currentUser } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [currentUser.uid]));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsersList(users);
      setLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <div className="flex flex-col">
          <h1 className="text-xl px-2 py-2">Users</h1>
          <div className=" divide-y-2">
            {usersList.map((user) => (
              <UserCard onSelect={onSelect} user={user} key={user.uid} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default LeftPane;
