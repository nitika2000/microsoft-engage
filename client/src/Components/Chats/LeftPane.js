import React from "react";
import { useAuth } from "../AuthContext";
import UserCard from "./UserCard";
import { useState, useEffect } from "react";
import { collection, where, query, onSnapshot } from "@firebase/firestore";
import db from "../../services/firebase-config";

function LeftPane({ onSelect }) {
  const { currentUser } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("social");

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "not-in", [currentUser.uid]));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsersList(users);
      setLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);

  const activeTabClasses = " bg-purple-600 text-white";
  const deactiveTabClasses = " bg-transparent text-purple-500";

  return (
    <>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <div className="flex flex-col">
          <div>
            <div className="flex py-2 w-full items-center justify-start">
              <button
                className={
                  "border-l border-t border-b border-purple-500 hover:bg-purple-500 hover:text-white active:bg-purple-600 font-bold uppercase text-xs px-4 py-2 rounded-l outline-none focus:outline-none ease-linear transition-all duration-150" +
                  (activeTab === "social" ? activeTabClasses : deactiveTabClasses)
                }
                type="button"
                onClick={() => setActiveTab("social")}
              >
                Social
              </button>
              <button
                className={
                  "border-t border-b border-r border-purple-500 hover:bg-purple-500 hover:text-white active:bg-purple-600 font-bold uppercase text-xs px-4 py-2 rounded-r outline-none focus:outline-none ease-linear transition-all duration-150" +
                  (activeTab === "academic" ? activeTabClasses : deactiveTabClasses)
                }
                type="button"
                onClick={() => setActiveTab("academic")}
              >
                Academic
              </button>
            </div>
            <div className="relative py-2 flex w-full flex-wrap items-center">
              <span className="z-10 leading-snug font-normal absolute z-10 text-center text-gray-400 bg-transparent rounded text-base items-center justify-center w-8 pl-2 py-1">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search"
                className=" px-2 py-2 placeholder-gray-400 text-gray-600 relative bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:ring w-full pl-10"
              />
            </div>
            <h1 className="text-xl px-2 py-2">{activeTab === "social" ? "Users" : "Classes"}</h1>
          </div>
          <div className=" divide-y-2">
            {usersList.map((user) => (
              <UserCard onSelect={onSelect} user={user} key={user.uid} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default LeftPane;
