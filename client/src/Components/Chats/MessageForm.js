import React from "react";

const MessageForm = ({ handleSubmit, text, setText }) => {
  return (
    <form className="message_form w-full flex gap-2 pt-2" onSubmit={handleSubmit}>
      <input
        className="px-4 min-w-0 py-2 bg-gray-200 outline-none ring-0 rounded-md focus:ring-2 focus:ring-indigo-600 border-gray-300 flex-grow"
        type="text"
        placeholder="Enter message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn px-4 py-2 bg-green-400 rounded-md hover:opacity-80 active:scale-95" type="submit">
        Send
      </button>
    </form>
  );
};

export default MessageForm;
