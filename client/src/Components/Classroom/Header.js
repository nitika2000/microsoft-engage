import React from "react";
import { useState } from "react";
import CreateClass from "./CreateClassForm";
import JoinClass from "./JoinClass";
import db from "../../services/firebase-config";
import { collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { getSlug } from "../../services/helper";
import { getAuth } from "@firebase/auth";

const classCodeLen = 6;

function Header() {
  const [showJoinForm, setshowJoinForm] = useState(false);
  const [showCreateForm, setshowCreateForm] = useState(false);
  const { currentUser } = getAuth();
  console.log("current user uid", currentUser);
  const joinClass = (classCode) => {
    console.log(classCode);
    setshowJoinForm(false);
  };

  const createClass = async (className) => {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    const userRef = docSnap.data();
    const classObj = {
      className: className,
      creatorName: userRef.uname,
      creatorUid: userRef.uid,
      classCode: getSlug(classCodeLen),
    };
    const classRef = await addDoc(collection(db, "classrooms"), classObj);

    userRef.enrolledClasses.push(classRef.id);
    console.log(classRef.id);
    await setDoc(doc(collection(db, "users"), currentUser.uid), {
      ...userRef,
      enrolledClasses: userRef.enrolledClasses,
    });
    setshowCreateForm(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={() => {
          setshowJoinForm(true);
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Join classroom
      </button>

      <button
        onClick={() => {
          setshowCreateForm(true);
        }}
        className="bg-blue-500 mx-1 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create classroom
      </button>

      {showJoinForm ? (
        <JoinClass
          joinClass={joinClass}
          closeForm={() => setshowJoinForm(false)}
        />
      ) : null}

      {showCreateForm ? (
        <CreateClass
          createClass={createClass}
          closeForm={() => setshowCreateForm(false)}
        />
      ) : null}
    </div>
  );
}

export default Header;
