import {
  collection,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  getDoc,
  doc,
} from "@firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import db from "../../services/firebase-config";
import { useAuth } from "../AuthContext";
import moment from "moment";
import { getMessageId } from "../../services/helper";

function MainView({ selectedUser }) {
  const { currentUser } = useAuth();
  const [msgs, setMsgs] = useState([]);
  const [chatDate, setChatDate] = useState("");
  const [loading, setLoading] = useState(false);

  const msgRef = React.createRef();

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [msgs]);

  const updateLastMsg = async (msgId) => {
    const lastMsgSnap = await getDoc(doc(db, "lastMsgs", msgId));
    if (lastMsgSnap.data() && lastMsgSnap.data().to === currentUser.uid) {
      await setDoc(
        lastMsgSnap.ref,
        {
          unread: false,
        },
        { merge: true },
      );
    }
  };

  useEffect(() => {
    setLoading(true);

    const msgId = getMessageId(currentUser, selectedUser);
    const msgsRef = collection(db, "messages", msgId, "chats");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach(async (msgDoc) => {
        const data = msgDoc.data();
        var date = moment.utc(msgDoc.data().createdAt.seconds * 1000).local();
        data.timeString = date.format("LT");
        if (
          msgDoc.data().to === currentUser.uid &&
          msgDoc.data().unread === true
        ) {
          await setDoc(msgDoc.ref, { unread: false }, { merge: true });
        }

        msgs.push(data);
      });
      const msgsWithDate = [];
      if (msgs.length > 0) {
        const startDate = moment
          .utc(msgs[0].createdAt.seconds * 1000)
          .local()
          .format("L");
        msgsWithDate.push({ date: startDate });
      }
      for (let i = 1; i < msgs.length; i++) {
        const prevDate = moment
          .utc(msgs[i - 1].createdAt.seconds * 1000)
          .local()
          .format("L");
        const currentDate = moment
          .utc(msgs[i].createdAt.seconds * 1000)
          .local()
          .format("L");
        msgsWithDate.push(msgs[i]);
        if (prevDate !== currentDate) {
          msgsWithDate.push({ date: currentDate });
        }
      }
      setLoading(false);
      setMsgs(msgsWithDate);
      updateLastMsg(msgId);
    });

    return () => unsub();
  }, [selectedUser.uid]);

  const onScroll = (e) => {
    let minDist = 1000000;
    let cDate = "";
    for (let i = e.target.children.length - 1; i >= 0; i--) {
      const c = e.target.children[i];
      if (c.className.includes("date-capsule")) {
        const dist =
          e.target.getBoundingClientRect().y - c.getBoundingClientRect().y;
        if (c.getBoundingClientRect().y < 150 && dist < minDist) {
          minDist = dist;
          cDate = c.innerHTML;
        }
      }
    }
    if (cDate && cDate !== chatDate) {
      setChatDate(cDate);
    }
  };

  return (
    <>
      <div className="pr-4 flex justify-center">
        <div className="bg-blue-400 break-words max-w-full px-4 mt-2 py-1 mx-auto rounded-full">
          {chatDate}
        </div>
      </div>
      <div
        ref={msgRef}
        onScroll={onScroll}
        className="flex-grow py-4 relative pr-2 space-y-2 overflow-y-scroll"
      >
        {loading ? (
          "Loading..."
        ) : (
          <>
            {msgs.map((msg) => {
              if (msg.date) {
                return (
                  <h1 className="date-capsule bg-blue-400 px-4 rounded-full py-1 mx-auto w-[fit-content]">
                    {msg.date}
                  </h1>
                );
              }

              const className =
                msg.from === currentUser.uid
                  ? "bg-red-200 ml-auto rounded-tr-none pr-2"
                  : "bg-blue-400  rounded-tl-none";

              return (
                <div
                  key={msg.createdAt.seconds}
                  className={`bg-blue-400 break-words max-w-[80%] pl-4 pr-4 py-2 pb-3 w-[fit-content] rounded-md ${className}`}
                >
                  {msg.text}
                  <span className="relative -bottom-2 -right-2 text-[0.65rem] ml-auto text-gray-800">
                    {msg.timeString}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

export default MainView;
