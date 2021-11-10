import React from "react";
import { useState } from "react";
import JoinClass from "./JoinClass";

function Header() {
  const [showJoinForm, setshowJoinForm] = useState(false);

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

      {showJoinForm ? (
        <JoinClass closeForm={() => setshowJoinForm(false)} />
      ) : null}
    </div>
  );
}

export default Header;
