import { collection, query, orderBy, onSnapshot, setDoc, getDoc, doc } from "@firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import db from "../../services/firebase-config";
import { useAuth } from "../AuthContext";
import moment from "moment";
import { getMessageId } from "../../services/helper";
import Linkify from "react-linkify";
import Attachments from "./Attachments";
import ImageViewer from "react-simple-image-viewer";

function MainView({ selectedUser }) {
  const { currentUser } = useAuth();
  const [msgs, setMsgs] = useState([]);
  const [chatDate, setChatDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const msgRef = React.createRef();

  const chatsDivRef = React.createRef();

  const [images, setImages] = useState([]);

  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

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

  const handleImageClick = (index) => {
    setImageIndex(index);
    setImageViewerOpen(true);
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
      const allImages = [];
      querySnapshot.forEach(async (msgDoc) => {
        const data = msgDoc.data();
        var date = moment.utc(msgDoc.data().createdAt.seconds * 1000).local();
        data.timeString = date.format("LT");
        if (msgDoc.data().to === currentUser.uid && msgDoc.data().unread === true) {
          await setDoc(msgDoc.ref, { unread: false }, { merge: true });
        }
        msgs.push(data);
        if (data.attachments) {
          let i = allImages.length;
          for (let attach of data.attachments) {
            attach.index = i;
            i++;
          }
          allImages.push(...data.attachments.map((val) => val.downloadUrl));
        }
      });
      setImages(allImages);
      const msgsWithDate = [];
      if (msgs.length > 0) {
        const startDate = moment.utc(msgs[0].createdAt.seconds * 1000).local();
        msgsWithDate.push({ date: formatDate(startDate) });
        msgsWithDate.push(msgs[0]);
      }
      for (let i = 1; i < msgs.length; i++) {
        const prevDate = moment.utc(msgs[i - 1].createdAt.seconds * 1000).local();
        const currentDate = moment.utc(msgs[i].createdAt.seconds * 1000).local();
        msgsWithDate.push(msgs[i]);
        if (!prevDate.isSame(currentDate, "day")) {
          msgsWithDate.push({ date: formatDate(currentDate) });
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
      }, 4000);
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
      <div ref={msgRef} onScroll={onScroll} className="hide-scrollbar h-full max-w-full overflow-x-hidden overflow-y-scroll">
        <p
          className={`absolute shadow-sm z-50 bg-blue-300 text-xs break-words max-w-full px-4 mt-4 left-1/2 -translate-x-1/2  py-1 mx-auto transition-all duration-500 rounded-full ${
            opacity === 0 ? "opacity-0 " : "opacity-100"
          }`}
        >
          {chatDate}
        </p>
        <div ref={chatsDivRef} className="py-4 px-1 md:px-8 flex flex-col gap-2">
          {loading ? (
            "Loading..."
          ) : (
            <>
              {msgs.map((msg) => {
                if (msg.date) {
                  return <h1 className="date-capsule text-xs mb-4 bg-blue-200 px-4 rounded-full py-1 mx-auto w-[max-content]">{msg.date}</h1>;
                }

                const className = msg.from === currentUser.uid ? "bg-blue-200 ml-auto rounded-tr-none pr-1" : "bg-white  rounded-tl-none";

                return (
                  <div
                    key={msg.createdAt.seconds * 1000000 + msg.createdAt.nanoseconds}
                    className={`shadow-sm flex gap-2 items-center justify-between relative text-gray-800 text-sm break-words font-light  max-w-[80%] pl-4 pr-4 py-2 w-[fit-content] rounded-md ${className}`}
                  >
                    <Linkify
                      componentDecorator={(decoratedHref, decoratedText, key) => (
                        <a className="underline text-blue-600 font-bold" target="blank" href={decoratedHref} key={key}>
                          {decoratedText}
                        </a>
                      )}
                    >
                      {msg.attachments ? <Attachments attachments={msg.attachments} imageClick={handleImageClick} /> : null}
                      {msg.text}
                    </Linkify>
                    <div className="flex gap-1 self-end whitespace-nowrap">
                      <span className="relative text-[0.65rem] bottom-[-2px] ml-auto text-gray-600">{msg.timeString}</span>
                      {msg.from === currentUser.uid ? (
                        msg.unread ? (
                          <span class="material-icons bottom-0 right-1 text-base ">done</span>
                        ) : (
                          <span class="text-base material-icons text-blue-600">done_all</span>
                        )
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        {/* {JSON.stringify(images)} */}
      </div>
      {imageViewerOpen ? <ImageViewer closeOnClickOutside={true} src={images} currentIndex={imageIndex} disableScroll={true} onClose={() => setImageViewerOpen(false)} /> : null}
    </div>
  );
}

export default MainView;
