import { collection, query, orderBy, onSnapshot } from "@firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import db from "../../services/firebase-config";
import { useAuth } from "../AuthContext";
import moment from "moment";

function MainView({ selectedUser }) {
  const { currentUser } = useAuth();
  const [msgs, setMsgs] = useState([]);

  const msgRef = React.createRef();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(msgRef);
    if (msgRef.current) {
      // msgRef.current.scrollTo(0);
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
      // for (let c of msgRef.current.children) {
      //   if (c.className.contains("date-capsule") && c.offsetTop > msgRef.current.scrollTop) {
      //     console.log(c);
      //   }
      // }
    }
  }, [msgs]);

  useEffect(() => {
    setLoading(true);
    const user1 = currentUser.uid;
    const user2 = selectedUser.uid;
    console.log(user1, user2);
    const msgId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, "messages", msgId, "chats");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        var date = moment.utc(doc.data().createdAt.seconds * 1000).local();
        data.timeString = date.format("LT");
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
    });
    return () => unsub();
  }, [selectedUser.uid]);

  return (
    <div ref={msgRef} className="flex-grow py-4 relative pr-2 space-y-2 overflow-y-scroll">
      {loading ? "Loading..." : null}
      {msgs.map((msg) => {
        if (msg.date) {
          return <h1 className="date-capsule bg-blue-400 px-4 rounded-full py-1 mx-auto w-[fit-content]">{msg.date}</h1>;
        }

        const className = msg.from === currentUser.uid ? "bg-red-200 ml-auto rounded-tr-none pr-2" : "bg-blue-400  rounded-tl-none";

        return (
          <div key={msg.createdAt.seconds} className={`bg-blue-400 break-words max-w-full pl-4 pr-4 py-2 pb-3 w-[fit-content] rounded-md ${className}`}>
            {msg.text}
            <span className="relative -bottom-2 -right-2 text-[0.65rem] ml-auto text-gray-800">{msg.timeString}</span>
          </div>
        );
      })}
    </div>
  );
}

export default MainView;
