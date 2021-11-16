import React, { useState } from "react";
import { uploadFiles } from "../../services/helper";

const MessageForm = ({ handleSubmit, text, setText }) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [filesUploading, setFilesUploading] = useState(false);
  const inputFileRef = React.useRef();

  const onFileChange = (e) => {
    const files = [];
    const selectedFiles = e.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      files.push(selectedFiles[0]);
    }
    setSelectedFiles(files);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text && !selectedFiles) {
      return;
    }
    if (selectedFiles) {
      setFilesUploading(true);
      const path = `chat-attachments/`;
      uploadFiles(path, selectedFiles)
        .then((data) => {
          setFilesUploading(false);
          handleSubmit(data);
          setSelectedFiles(null);
        })
        .catch((err) => {
          setFilesUploading(false);
          selectedFiles(null);
        });
    } else {
      handleSubmit(null);
    }
  };

  return (
    <form className="message_form relative w-full  flex gap-2 pt-2" onSubmit={handleSend}>
      <div className="absolute bottom-[100%]">{selectedFiles ? <h1>{selectedFiles.length} selected</h1> : null}</div>
      <button
        type="button"
        onClick={() => inputFileRef.current.click()}
        className="disabled:opacity-70 btn px-4 py-2 bg-green-400 flex items-center justify-center rounded-md hover:opacity-80 active:scale-95"
      >
        <span class="material-icons">attachment</span>
        <input className="hidden" type="file" multiple ref={inputFileRef} onChange={onFileChange} />
      </button>
      <input
        className="px-4 min-w-0 py-2 bg-gray-200 outline-none ring-0 rounded-md focus:ring-2 focus:ring-indigo-600 border-gray-300 flex-grow"
        type="text"
        placeholder="Enter message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn px-4 py-2 bg-green-400 flex items-center justify-center rounded-md hover:opacity-80 active:scale-95" type="submit">
        {filesUploading ? <span className="inline-block w-4 h-4 border-2 border-gray-200 rounded-full border-t-blue-400 animate-spin"></span> : <span class="material-icons">send</span>}
      </button>
    </form>
  );
};

export default MessageForm;
