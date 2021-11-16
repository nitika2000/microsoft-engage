import React from "react";
import { useState } from "react";
import CreateClassForm from "./CreateClassForm";
import JoinClass from "./JoinClass";
import { isTeacher } from "../../services/helper";
import { useAuth } from "../AuthContext";

function Header() {
  const [showJoinForm, setshowJoinForm] = useState(false);
  const [showCreateForm, setshowCreateForm] = useState(false);
  const { currentUserData } = useAuth();

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
        <JoinClass closeForm={() => setshowJoinForm(false)} />
      ) : null}

      {showCreateForm ? (
        <CreateClassForm closeForm={() => setshowCreateForm(false)} />
      ) : null}
    </div>
  );
}

export default Header;
