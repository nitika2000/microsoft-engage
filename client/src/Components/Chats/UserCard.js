import { onSnapshot, doc } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import db from "../../services/firebase-config";
import { getMessageId, truncate } from "../../services/helper";
import { useAuth } from "../AuthContext";

function UserCard({ onSelect, user }) {
  const { currentUser } = useAuth();
  const [lastMsg, setLastMsg] = useState("--");
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    const msgId = getMessageId(currentUser, user);
    const unsub = onSnapshot(doc(db, "lastMsgs", msgId), (doc) => {
      if (doc.data()) {
        const lastMsg = doc.data().text;
        const truncMsg = truncate(lastMsg, 20);
        setLastMsg(truncMsg);
        if (doc.data().from !== currentUser.uid) {
          setUnread(doc.data().unread);
        }
      }
    });

    return unsub;
  }, []);

  return (
    <div>
      <div className="bg-gray-100 py-2 px-2  hover:bg-gray-200 cursor-pointer active:scale-95" onClick={() => onSelect(user)}>
        <div className="flex items-center justify-between">
          {user.uname}
          {/* <p className="w-2 h-2 rounded-full bg-green-500"></p> */}
          <p className="w-2 h-2 rounded-full bg-red-500"></p>
        </div>
        <div className="text-sm text-gray-600">{unread ? <b>{lastMsg}</b> : <p>{lastMsg}</p>}</div>
      </div>
    </div>
  );
}

export default UserCard;
