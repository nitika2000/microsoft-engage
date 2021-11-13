import React from "react";
import { useState } from "react";
import CreateClassForm from "./CreateClassForm";
import JoinClass from "./JoinClass";
import db from "../../services/firebase-config";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getClassFromCode, getSlug } from "../../services/helper";
import { getAuth } from "@firebase/auth";
import { getCurrentUserData } from "../../services/helper";

const classCodeLen = 6;

function Header() {
  const [showJoinForm, setshowJoinForm] = useState(false);
  const [showCreateForm, setshowCreateForm] = useState(false);
  const { currentUser } = getAuth();

  const joinClass = async (classCode) => {
    const currentUserData = await getCurrentUserData(currentUser);
    const classObj = await getClassFromCode(classCode);

    currentUserData.enrolledClasses.push({
      className: classObj.className,
      classId: classObj.classId,
    });
    await setDoc(doc(collection(db, "users"), currentUser.uid), {
      ...currentUserData,
      enrolledClasses: currentUserData.enrolledClasses,
    });
    setshowJoinForm(false);
  };

  const createClass = async (className) => {
    const currentUserData = await getCurrentUserData(currentUser);
    const classObj = {
      className: className,
      creatorName: currentUserData.uname,
      creatorUid: currentUserData.uid,
      classCode: getSlug(classCodeLen),
      classId: "",
    };

    const classRef = await addDoc(collection(db, "classrooms"), classObj);
    await setDoc(doc(collection(db, "classrooms"), classRef.id), {
      ...classObj,
      classId: classRef.id,
    });

    currentUserData.enrolledClasses.push({
      className: classObj.className,
      classId: classObj.classId,
    });

    await setDoc(doc(collection(db, "users"), currentUser.uid), {
      ...currentUserData,
      enrolledClasses: currentUserData.enrolledClasses,
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
        <CreateClassForm
          createClass={createClass}
          closeForm={() => setshowCreateForm(false)}
        />
      ) : null}
    </div>
  );
}

export default Header;
