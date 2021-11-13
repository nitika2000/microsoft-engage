import React from "react";
import { useState } from "react";
import CreateClassForm from "./CreateClassForm";
import JoinClass from "./JoinClass";
import db from "../../services/firebase-config";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getSlug } from "../../services/helper";
import { getAuth } from "@firebase/auth";
import { getCurrentUserData } from "../../services/helper";

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
    const currentUserData = await getCurrentUserData(currentUser);
    const classObj = {
      className: className,
      creatorName: currentUserData.uname,
      creatorUid: currentUserData.uid,
      classCode: getSlug(classCodeLen),
    };

    try {
      const classRef = await addDoc(collection(db, "classrooms"), classObj);

      currentUserData.enrolledClasses.push({
        className: classObj.className,
        classId: classRef.id,
      });
      await setDoc(doc(collection(db, "users"), currentUser.uid), {
        ...currentUserData,
        enrolledClasses: currentUserData.enrolledClasses,
      });
      setshowCreateForm(false);
    } catch {
      console.log("Something bad happened");
    }
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
        <CreateClassForm
          createClass={createClass}
          closeForm={() => setshowCreateForm(false)}
        />
      ) : null}
    </div>
  );
}

export default Header;
