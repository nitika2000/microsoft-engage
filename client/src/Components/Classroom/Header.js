import React from "react";
import { useState } from "react";
import CreateClassForm from "./CreateClassForm";
import JoinClass from "./JoinClass";
import db from "../../services/firebase-config";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getClassFromCode, getSlug, isTeacher } from "../../services/helper";
import { useAuth } from "../AuthContext";

const classCodeLen = 6;

function Header() {
  const [showJoinForm, setshowJoinForm] = useState(false);
  const [showCreateForm, setshowCreateForm] = useState(false);
  const { currentUserData } = useAuth();
  const [error, seterror] = useState(null);

  const joinClass = async (classCode) => {
    const classObj = await getClassFromCode(classCode);
    if (!classObj) {
      seterror("Invalid class code");
      return;
    }

    const isAlreadyJoined = currentUserData.enrolledClasses.find(
      (enrolledClass) => enrolledClass.classId === classObj.classId,
    );

    if (!isAlreadyJoined) {
      currentUserData.enrolledClasses.push({
        className: classObj.className,
        classId: classObj.classId,
        creatorName: classObj.creatorName,
      });
      await setDoc(doc(collection(db, "users"), currentUserData.uid), {
        ...currentUserData,
        enrolledClasses: currentUserData.enrolledClasses,
      });

      let updatedEnrolledList = classObj.enrolledStudents;
      updatedEnrolledList.push(currentUserData.uid);
      await setDoc(
        doc(collection(db, "classrooms"), classObj.classId),
        {
          enrolledStudents: updatedEnrolledList,
        },
        { merge: true },
      );
      setshowJoinForm(false);
    } else {
      seterror("Class is already joined");
    }
  };

  const createClass = async (className) => {
    const classObj = {
      className: className,
      creatorName: currentUserData.uname,
      creatorUid: currentUserData.uid,
      classCode: getSlug(classCodeLen),
      classId: "",
      enrolledStudents: [],
    };

    const classRef = await addDoc(collection(db, "classrooms"), classObj);
    await setDoc(doc(collection(db, "classrooms"), classRef.id), {
      ...classObj,
      classId: classRef.id,
    });

    currentUserData.enrolledClasses.push({
      className: classObj.className,
      classId: classRef.id,
      creatorName: classObj.creatorName,
    });

    await setDoc(doc(collection(db, "users"), currentUserData.uid), {
      ...currentUserData,
      enrolledClasses: currentUserData.enrolledClasses,
    });
    setshowCreateForm(false);
  };

  return (
    <div className="p-4">
      {!isTeacher(currentUserData.role) ? (
        <button
          onClick={() => {
            setshowJoinForm(true);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Join classroom
        </button>
      ) : (
        <button
          onClick={() => {
            setshowCreateForm(true);
          }}
          className="bg-blue-500 mx-1 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create classroom
        </button>
      )}
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
