import { collection, query, orderBy, onSnapshot, setDoc, getDoc, doc } from "@firebase/firestore";
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
  const [opacity, setOpacity] = useState(0);

  const msgRef = React.createRef();

  const chatsDivRef = React.createRef();

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

    var fulldays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function formatDate(someDateTimeStamp) {
      var dt = new Date(someDateTimeStamp),
        date = dt.getDate(),
        month = months[dt.getMonth()],
        diffDays = new Date().getDate() - date,
        diffMonths = new Date().getMonth() - dt.getMonth(),
        diffYears = new Date().getFullYear() - dt.getFullYear();

      if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
        return "Today";
      } else if (diffYears === 0 && diffDays === 1) {
        return "Yesterday";
      } else if (diffYears === 0 && diffDays === -1) {
        return "Tomorrow";
      } else if (diffYears === 0 && diffDays < -1 && diffDays > -7) {
        return fulldays[dt.getDay()];
      } else if (diffYears >= 1) {
        return date + " " + month + ", " + new Date(someDateTimeStamp).getFullYear();
      } else {
        return date + " " + month;
      }
    }

    const unsub = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach(async (msgDoc) => {
        const data = msgDoc.data();
        var date = moment.utc(msgDoc.data().createdAt.seconds * 1000).local();
        data.timeString = date.format("LT");
        if (msgDoc.data().to === currentUser.uid && msgDoc.data().unread === true) {
          await setDoc(msgDoc.ref, { unread: false }, { merge: true });
        }

        msgs.push(data);
      });
      const msgsWithDate = [];
      if (msgs.length > 0) {
        const startDate = moment.utc(msgs[0].createdAt.seconds * 1000).local();
        msgsWithDate.push({ date: formatDate(startDate) });
        msgsWithDate.push(msgs[0]);
      }
      console.log(msgsWithDate);
      for (let i = 1; i < msgs.length; i++) {
        const prevDate = moment.utc(msgs[i - 1].createdAt.seconds * 1000).local();
        const currentDate = moment.utc(msgs[i].createdAt.seconds * 1000).local();
        msgsWithDate.push(msgs[i]);
        if (!prevDate.isSame(currentDate, "day")) {
          msgsWithDate.push({ date: formatDate(currentDate) });
          console.log(formatDate(currentDate));
        }
      }
      setLoading(false);
      setMsgs(msgsWithDate);
      updateLastMsg(msgId);
    });

    return () => unsub();
  }, [selectedUser.uid]);

  const onScroll = (e) => {
    if (opacity === 0) {
      setOpacity(100);
      setTimeout(() => {
        setOpacity(0);
      }, 2000);
    }
    let minDist = 1000000;
    let cDate = "";
    const chatsDiv = chatsDivRef.current;
    // console.log(e.target.scrollTop, e.target.offsetTop);
    for (let i = chatsDiv.children.length - 1; i >= 0; i--) {
      const c = chatsDiv.children[i];
      if (c.className.includes("date-capsule")) {
        const { y: chatDivY } = chatsDiv.getBoundingClientRect();
        const { y: dateCapsuleY } = c.getBoundingClientRect();
        const dist = chatDivY - dateCapsuleY;
        if (dateCapsuleY < 150 && dist < minDist) {
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
    <div className="overflow-hidden flex-grow relative">
      <div ref={msgRef} onScroll={onScroll} className="h-full overflow-y-scroll">
        <p
          className={`absolute bg-blue-200 text-xs break-words max-w-full px-4 mt-4 left-1/2 -translate-x-1/2  py-1 mx-auto transition-all duration-500 rounded-full ${
            opacity === 0 ? "opacity-0 " : "opacity-100"
          }`}
        >
          {chatDate}
        </p>
        <div ref={chatsDivRef} className="py-4 md:pr-2 flex flex-col gap-2">
          {loading ? (
            "Loading..."
          ) : (
            <>
              {msgs.map((msg) => {
                if (msg.date) {
                  return <h1 className="date-capsule text-xs mb-4 bg-blue-200 px-4 rounded-full py-1 mx-auto w-[max-content]">{msg.date}</h1>;
                }

                const className = msg.from === currentUser.uid ? "bg-red-200 ml-auto rounded-tr-none pr-2" : "bg-blue-400  rounded-tl-none";

                return (
                  <div key={msg.createdAt.seconds} className={`bg-blue-400 text-sm md:text-base break-words max-w-[80%] pl-4 pr-4 py-2 pb-3 w-[fit-content] rounded-md ${className}`}>
                    {msg.text}
                    <span className="relative -bottom-2 -right-1 text-[0.65rem] ml-auto text-gray-800">{msg.timeString}</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainView;
