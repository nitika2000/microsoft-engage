import React from "react";
import { useState } from "react";
import CreateClass from "./CreateClass";
import JoinClass from "./JoinClass";
import db from "../../services/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { getSlug } from "../../services/helper";

const classCodeLen = 6;

function Header() {
  const [showJoinForm, setshowJoinForm] = useState(false);
  const [showCreateForm, setshowCreateForm] = useState(false);

  const joinClass = (classCode) => {
    console.log(classCode);
    setshowJoinForm(false);
  };

  const createClass = async (className, uname) => {
    console.log(className, uname);
    const classObj = {
      name: className,
      admin: uname,
      classCode: getSlug(classCodeLen),
    };
    await addDoc(collection(db, "classrooms"), classObj);

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
