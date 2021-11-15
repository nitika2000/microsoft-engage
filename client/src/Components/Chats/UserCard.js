import { collection, onSnapshot, doc } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import db from "../../services/firebase-config";
import { getMessageId } from "../../services/helper";
import { useAuth } from "../AuthContext";

function UserCard({ onSelect, user }) {
  const { currentUser } = useAuth();
  const [lastMsg, setLastMsg] = useState(" ");

  useEffect(() => {
    const msgId = getMessageId(currentUser, user);
    const unsub = onSnapshot(doc(db, "lastMsgs", msgId), (doc) => {
      if (doc.data()) {
        setLastMsg(doc.data().text);
      }
    });

    return unsub;
  }, []);

  return (
    <div>
      <div
        className="bg-gray-100 py-2 px-2  hover:bg-gray-200 cursor-pointer active:scale-95"
        onClick={() => onSelect(user)}
      >
        <div className="flex items-center justify-between">
          {user.uname}
          {/* <p className="w-2 h-2 rounded-full bg-green-500"></p> */}
          <p className="w-2 h-2 rounded-full bg-red-500"></p>
        </div>
        <p className="text-sm text-gray-600">{lastMsg}</p>
      </div>
    </div>
  );
}

export default UserCard;
