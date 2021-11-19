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
import Linkify from "react-linkify";
import Attachments from "./Attachments";
import ImageViewer from "react-simple-image-viewer";
import TaggedMsg from "./TaggedMsg";
import { Transition } from "@headlessui/react";

function MainView({ selectedUser, onMsgTag, taggedMsg, isClassroom }) {
  const { currentUser } = useAuth();
  const [msgs, setMsgs] = useState([]);
  const [chatDate, setChatDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [highlightMsg, setHighlightMsg] = useState("");
  const [scrollToBottomVisibility, setScrollToBottomVisibility] =
    useState(false);
  const [taggedMsgState, setTaggedMsgState] = useState("unset");

  const msgRef = React.createRef();

  const chatsDivRef = React.createRef();

  const chatDateRef = React.createRef();

  const [images, setImages] = useState([]);

  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (taggedMsg === null) {
      setTaggedMsgState("unset");
    }
  }, [taggedMsg]);

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

  const formatDate = (dateTimeStamp) => {
    var fulldays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    var dt = new Date(dateTimeStamp),
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
    } else if (diffYears === 0 && diffDays > 1 && diffDays < 7) {
      console.log(dt);
      return fulldays[dt.getDay()];
    } else if (diffYears >= 1) {
      return date + " " + month + ", " + new Date(dateTimeStamp).getFullYear();
    } else {
      return date + " " + month;
    }
  };

  useEffect(() => {
    setLoading(true);
    setScrollToBottomVisibility(false);

    const msgId = isClassroom
      ? selectedUser.uid
      : getMessageId(currentUser, selectedUser);
    const msgsRef = collection(db, "messages", msgId, "chats");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      const allImages = [];
      querySnapshot.forEach(async (msgDoc) => {
        const data = msgDoc.data();
        data.id = msgDoc.id;
        var date = moment.utc(msgDoc.data().createdAt.seconds * 1000).local();
        data.timeString = date.format("LT");
        if (
          msgDoc.data().to === currentUser.uid &&
          msgDoc.data().unread === true
        ) {
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
        const prevDate = moment
          .utc(msgs[i - 1].createdAt.seconds * 1000)
          .local();
        const currentDate = moment
          .utc(msgs[i].createdAt.seconds * 1000)
          .local();
        if (!prevDate.isSame(currentDate, "day")) {
          msgsWithDate.push({ date: formatDate(currentDate) });
        }
        msgsWithDate.push(msgs[i]);
      }
      setLoading(false);
      setMsgs(msgsWithDate);
      if (!isClassroom) updateLastMsg(msgId);
    });

    return () => unsub();
  }, [selectedUser.uid]);

  const scrollToBottom = () => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  };

  const scrollTo = (msgId) => {
    for (const c of chatsDivRef.current.children) {
      if (c.id === msgId) {
        msgRef.current.scrollTop = c.offsetTop - 50;
        setHighlightMsg(msgId);
        setTimeout(() => {
          setHighlightMsg("");
        }, 2000);
      }
    }
  };

  const onScroll = (e) => {
    if (opacity === 0) {
      setOpacity(100);
      setTimeout(() => {
        setOpacity(0);
      }, 4000);
    }
    let cDate = "";
    const chatsDiv = chatsDivRef.current;
    const chatDateCapsuleY = chatDateRef.current?.getBoundingClientRect().y;
    for (let i = chatsDiv.children.length - 1; i >= 0; i--) {
      const c = chatsDiv.children[i];
      if (c.className.includes("date-capsule-parent")) {
        const { y: dateCapsuleY } = c.firstChild.getBoundingClientRect();
        if (dateCapsuleY <= chatDateCapsuleY) {
          cDate = c.firstChild.innerHTML;
          break;
        }
      }
    }
    if (cDate && cDate !== chatDate) {
      setChatDate(cDate);
    }
    const msgRefElem = msgRef.current;

    const showButton = !(
      msgRefElem.scrollHeight -
        (msgRefElem.scrollTop + msgRefElem.offsetHeight) <
      100
    );
    if (showButton) {
      setScrollToBottomVisibility(true);
    } else {
      setScrollToBottomVisibility(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-14 h-14 border-4 border-t-blue-500 rounded-full border-gray-700 animate-spin"></div>
    );
  }

  const isLastMsgFromAnotherUser = (currentIndex) => {
    const lastMsg = currentIndex > 0 ? msgs[currentIndex - 1] : null;
    const currentMsg = msgs[currentIndex];
    if (lastMsg.date || currentMsg.date) {
      return false;
    } else if (lastMsg.from !== currentMsg.from) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="overflow-hidden flex-grow relative">
      <div
        ref={msgRef}
        onScroll={onScroll}
        className="chats-scroll-div hide-scrollbar h-full max-w-full overflow-x-hidden overflow-y-scroll"
      >
        <p
          ref={chatDateRef}
          className={`absolute shadow-sm z-50 bg-blue-300 text-xs break-words max-w-full px-4 mt-4 left-1/2 -translate-x-1/2  py-1 mx-auto transition-all duration-500 rounded-full ${
            opacity === 0 ? "opacity-0 " : "opacity-100"
          }`}
        >
          {chatDate}
        </p>
        <button
          onClick={scrollToBottom}
          className={
            "bottom-0 absolute flex right-0 h-10 w-10 transition-transform bg-opacity-60 items-center justify-center border-2 border-blue-500 bg-blue-200 shadow-lg active:scale-95 z-50 rounded-full " +
            (scrollToBottomVisibility ? "scale-100" : "scale-0")
          }
        >
          <span class="material-icons">expand_more</span>
        </button>
        <div ref={chatsDivRef} className="py-4 px-1 md:px-8 flex flex-col">
          {msgs.map((msg, index) => {
            if (msg.date) {
              return (
                <div className="date-capsule-parent relative after:absolute after:w-full after:h-[2px] after:bg-gray-300 flex items-center after:z-[0]">
                  <h1
                    key={index}
                    className="date-capsule text-xs my-4  bg-blue-200 px-4 rounded-full py-1 mx-auto z-10 w-[max-content]"
                  >
                    {msg.date}
                  </h1>
                </div>
              );
            }

            const className =
              msg.from === currentUser.uid
                ? "bg-blue-200 ml-auto rounded-tr-none pr-1"
                : "bg-white  rounded-tl-none";

            return (
              <div
                id={msg.id}
                key={msg.id}
                className={`shadow-sm flex gap-2 items-center justify-between relative text-gray-800 text-sm break-words font-light  max-w-[80%] pl-4 pr-4 py-2 w-[fit-content] rounded-md ${className} ${
                  highlightMsg === msg.id
                    ? "bg-blue-300 text-white animate-pulse"
                    : " " +
                      (isLastMsgFromAnotherUser(index) ? " mt-5" : " mt-1")
                }`}
              >
                <div className="min-w-0">
                  {msg.taggedMsg ? (
                    <TaggedMsg
                      onClickHandler={() => scrollTo(msg.taggedMsg?.id)}
                      msg={msg.taggedMsg}
                    />
                  ) : null}
                  {msg.attachments ? (
                    <Attachments
                      attachments={msg.attachments}
                      imageClick={handleImageClick}
                    />
                  ) : null}
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a
                        className="underline text-blue-600 font-bold"
                        target="blank"
                        href={decoratedHref}
                        key={key}
                      >
                        {decoratedText}
                      </a>
                    )}
                  >
                    {isClassroom && msg.from !== currentUser.uid ? (
                      <div className="text-sm font-bold text-blue-600">
                        {msg.senderName}
                      </div>
                    ) : null}
                    {msg.text}
                  </Linkify>
                </div>
                <div className="flex  relative -bottom-2 -right-2 gap-1 self-end whitespace-nowrap items-center">
                  <span className="text-[0.65rem] ml-auto text-gray-700">
                    {msg.timeString}
                  </span>
                  {msg.from === currentUser.uid ? (
                    msg.unread ? (
                      <span class="material-icons bottom-0 right-1 text-base ">
                        done
                      </span>
                    ) : (
                      <span class="text-base material-icons text-blue-600">
                        done_all
                      </span>
                    )
                  ) : null}
                  <button
                    onClick={() => {
                      onMsgTag({
                        ...msg,
                        uname:
                          msg.from === currentUser.uid
                            ? currentUser.uname || "you"
                            : selectedUser.uname,
                      });
                      setTaggedMsgState("open");
                    }}
                  >
                    <span class="text-gray-600 text-sm material-icons">
                      reply
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <Transition
          show={taggedMsg && taggedMsgState !== "closed" ? true : false}
          enter="transition-all duration-300"
          enterFrom="opacity-0 scale-0"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-300"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-0"
          afterLeave={() => {
            onMsgTag(null);
          }}
        >
          <div
            className={
              "absolute rounded-md text-gray-800 bottom-0 py-2 px-4 w-11/12 bg-opacity-70 bg-blue-300 border-l-4 border-l-blue-600 transition-transform "
            }
          >
            <h1 className="text">{taggedMsg?.uname}</h1>
            <p className="text-sm">{taggedMsg?.text}</p>
            <button
              className="absolute right-2 top-2"
              onClick={() => {
                setTaggedMsgState("closed");
              }}
            >
              <span class="material-icons">close</span>
            </button>
          </div>
        </Transition>
      </div>
      {imageViewerOpen ? (
        <ImageViewer
          closeOnClickOutside={true}
          src={images}
          currentIndex={imageIndex}
          disableScroll={true}
          onClose={() => setImageViewerOpen(false)}
        />
      ) : null}
    </div>
  );
}

export default MainView;
