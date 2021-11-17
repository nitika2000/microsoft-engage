import React from "react";

const TaggedMsg = ({ msg, onClickHandler }) => {
  return (
    <div onClick={onClickHandler} className="bg-blue-300 cursor-pointer px-2 py-1 border-l-4 mb-2 border-l-blue-600 rounded-sm">
      <h1 className="font-bold text-sm">{msg.uname}</h1>
      <p className="font-bold text-gray-600 text-xs truncate">{msg.text}</p>
    </div>
  );
};

export default TaggedMsg;
