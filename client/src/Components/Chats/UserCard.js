import { onSnapshot, doc } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import db from "../../services/firebase-config";
import { getMessageId, truncate } from "../../services/helper";
import { useAuth } from "../AuthContext";
import Avatar from "./Avatar";
import Highlighter from "react-highlight-words";

function UserCard({ onSelect, user, isSelected, searchedName }) {
  const { currentUser } = useAuth();
  const [lastMsg, setLastMsg] = useState("");
  const [unread, setUnread] = useState(false);
  const [lastMsgDoc, setLastMsgDoc] = useState(null);

  useEffect(() => {
    const msgId = getMessageId(currentUser, user);
    const unsub = onSnapshot(doc(db, "lastMsgs", msgId), (doc) => {
      if (doc.data()) {
        const lastMsg = doc.data().text;
        setLastMsgDoc(doc.data());
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
    <div
      className={
        (isSelected ? "bg-blue-400" : "bg-white") +
        " gap-2 items-center shadow-sm py-4 rounded-md transition-all hover:scale-105 hover:shadow-md px-2 cursor-pointer active:scale-95 " +
        (user.uname.toLowerCase().includes(searchedName) ? "flex" : "hidden")
      }
      onClick={() => onSelect(user)}
    >
      <Avatar name={user.uname} w="w-12" h="h-12" />
      <div>
        <div>
          <Highlighter searchWords={[searchedName]} textToHighlight={user.uname} autoEscape={true} />
        </div>
        <div className="text-sm flex items-center gap-2 text-gray-700">
          {lastMsgDoc?.from === currentUser.uid ? <p>{lastMsg}</p> : <p className={unread ? "font-bold" : ""}>{lastMsg}</p>}
          {lastMsgDoc?.to === currentUser.uid || !lastMsg ? null : lastMsgDoc?.unread ? (
            <span class="material-icons bottom-0 right-1 text-base ">done</span>
          ) : (
            <span class="text-base material-icons text-blue-600">done_all</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCard;
