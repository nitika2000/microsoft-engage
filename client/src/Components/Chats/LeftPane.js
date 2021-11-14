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

  return (
    <>
      <div className="bg-gray-100 w-1/4 flex flex-col divide-y-2">
        {userList.map((user) => (
          <div className="bg-gray-100 py-2 px-2  hover:bg-gray-200 cursor-pointer active:scale-95" onClick={() => onSelect(user)}>
            <div className="flex items-center justify-between">
              {user.uname}
              {/* <p className="w-2 h-2 rounded-full bg-green-500"></p> */}
              <p className="w-2 h-2 rounded-full bg-red-500"></p>
            </div>
            <p className="text-sm text-gray-600">How are you</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default LeftPane;
