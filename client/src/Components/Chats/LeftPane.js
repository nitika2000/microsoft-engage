import React from "react";
import { useAuth } from "../AuthContext";
import UserCard from "./UserCard";
import { useState, useEffect } from "react";
import {
  collection,
  where,
  query,
  onSnapshot,
  doc,
  getDoc,
} from "@firebase/firestore";
import db from "../../services/firebase-config";
import { mimicClassAsUser } from "../../services/helper";

function LeftPane({ onSelect, setIsClassroom }) {
  const { currentUser } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("social");
  const [selectedUser, setSelectedUser] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [lastMsgs, setLastMsgs] = useState();

  const getLastMsgTime = async (currentUserUid, otherUserUid) => {
    const msgId =
      currentUserUid > otherUserUid
        ? `${currentUserUid + otherUserUid}`
        : `${currentUserUid + otherUserUid}`;
    return await getDoc(doc(collection(db, "lastMsgs"), msgId));
  };

  useEffect(() => {
    setLoading(true);

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [currentUser.uid]));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });

      var promises = [];
      users.forEach((user) => {
        const promise = new Promise(async (resolve, reject) => {
          const msgId =
            currentUser.uid > user.uid
              ? `${currentUser.uid + user.uid}`
              : `${currentUser.uid + user.uid}`;
          await getDoc(doc(collection(db, "lastMsgs"), msgId)).then((msg) => {
            resolve({
              ...user,
              lastMsgTime: msg.data()
                ? msg.data().createdAt
                : new Date(-8640000000000000),
            });
          });
        });
        promises.push(promise);
      });

      Promise.all(promises).then((data) => {
        data.sort(function (a, b) {
          const keyA = a.lastMsgTime;
          const keyB = b.lastMsgTime;
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        });
        setUsersList(data);
        setLoading(false);
      });
    });

    const classSub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      setEnrolledClasses(doc.data().enrolledClasses);
      setLoading(false);
    });

    return () => {
      unsub();
      classSub();
    };
  }, [lastMsgs]);

  console.log(usersList);

  const activeTabClasses = " bg-blue-600 text-white";
  const deactiveTabClasses = " bg-transparent text-blue-500";

  return (
    <>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <div className="flex flex-col max-h-full">
          <div>
            <div className="flex py-2 w-full items-center justify-start">
              <button
                className={
                  "border-l border-t border-b border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-l outline-none focus:outline-none ease-linear transition-all duration-150" +
                  (activeTab === "social"
                    ? activeTabClasses
                    : deactiveTabClasses)
                }
                type="button"
                onClick={() => setActiveTab("social")}
              >
                Social
              </button>
              <button
                className={
                  "border-t border-b border-r border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-r outline-none focus:outline-none ease-linear transition-all duration-150" +
                  (activeTab === "academic"
                    ? activeTabClasses
                    : deactiveTabClasses)
                }
                type="button"
                onClick={() => setActiveTab("academic")}
              >
                Academic
              </button>
            </div>
            <div className="relative py-2 flex w-full flex-wrap items-center">
              <span className="z-10 leading-snug font-normal absolute text-center text-gray-800 bg-transparent rounded text-base items-center justify-center w-8 pl-2 py-1">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search"
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(e.target.value.trimStart().toLowerCase())
                }
                className=" px-2 py-2 placeholder-gray-400 text-gray-600 relative bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:ring w-full pl-10"
              />
            </div>
            <h1 className="text-xl px-2 py-2">
              {activeTab === "social" ? "Users" : "Classes"}
            </h1>
          </div>
          <div className="hide-scrollbar space-y-4 px-2 overflow-y-scroll overflow-x-visible first:rounded-t-md">
            {activeTab === "social"
              ? usersList.map((user) => (
                  <UserCard
                    searchedName={searchInput}
                    onSelect={() => {
                      setSelectedUser(user.uid);
                      onSelect(user);
                      setIsClassroom(false);
                    }}
                    user={user}
                    key={user.uid}
                    isSelected={user.uid === selectedUser}
                  />
                ))
              : enrolledClasses.map((classroom) => (
                  <UserCard
                    searchedName={searchInput}
                    onSelect={() => {
                      setSelectedUser(classroom.classId);
                      onSelect(mimicClassAsUser(classroom));
                      setIsClassroom(true);
                    }}
                    isClassroom={true}
                    user={mimicClassAsUser(classroom)}
                    key={classroom.classId}
                    isSelected={classroom.classId === selectedUser}
                  />
                ))}
          </div>
        </div>
      )}
    </>
  );
}

export default LeftPane;
