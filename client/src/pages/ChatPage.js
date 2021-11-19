import React, { useEffect } from "react";
import { useState } from "react";
import LeftPane from "../Components/Chats/LeftPane";
import ChatView from "../Components/Chats/ChatView";

function ChatPage() {
  const [selectedUser, setSelectedUser] = useState();
  const [isClassroom, setIsClassroom] = useState(false);

  const [activePage, setActivePage] = useState("users");

  const [phoneView, setPhoneView] = useState(
    window.innerWidth < 500 ? true : false,
  );

  useEffect(() => {
    const onWindowResize = () => {
      if (window.innerWidth < 500) {
        setPhoneView(true);
      } else {
        setPhoneView(false);
      }
    };
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  const onUserSelect = (user) => {
    console.log("run selecte");
    setActivePage("chat");
    setSelectedUser(user);
  };

  return (
    <div className="flex h-[calc(100vh-72px)] md:h-[calc(100vh-128px)] bg-blueGray-100 rounded-md container mx-auto shadow-md border px-2 py-2 md:p-4 gap-4 mt-2 md:mt-8 divide-x-0 md:divide-x-2 ">
      <div
        className={`w-full md:w-1/4 ${
          phoneView && activePage === "chat" ? "hidden" : "block"
        }`}
      >
        <LeftPane onSelect={onUserSelect} setIsClassroom={setIsClassroom} />
      </div>

      <div
        className={`w-full md:w-3/4 pl-0 md:pl-4 ${
          phoneView && activePage === "users" ? "hidden" : "block"
        }`}
      >
        <ChatView
          selectedUser={selectedUser}
          isClassroom={isClassroom}
          onBackClick={() => setActivePage("users")}
        />
      </div>
    </div>
  );
}

export default ChatPage;
