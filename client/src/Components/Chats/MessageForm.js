import React, { useEffect, useState } from "react";
import { uploadFiles } from "../../services/helper";
import Picker from "emoji-picker-react";

const MessageForm = ({
  handleSubmit,
  text,
  setText,
  setFocus,
  isClassroom,
}) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [filesUploading, setFilesUploading] = useState(false);
  const inputFileRef = React.useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    // setChosenEmoji(emojiObject);
    setText(text + emojiObject.emoji);
  };

  const onFileChange = (e) => {
    const files = [];
    const selectedFiles = e.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      files.push(selectedFiles[i]);
    }
    setSelectedFiles(files);
  };

  useEffect(() => {
    const sub = document
      .querySelector("body")
      .addEventListener("click", (e) => {
        // console.log(e, "dd");
      });
    return sub;
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    setEmojiPickerOpen(false);
    if (!text && !selectedFiles) {
      return;
    }
    if (selectedFiles) {
      setFilesUploading(true);
      const path = `chat-attachments/`;
      uploadFiles(path, selectedFiles)
        .then((data) => {
          console.log(data);
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
    <form
      className="message_form relative w-full  flex gap-2 pt-2"
      onSubmit={handleSend}
    >
      <div className="absolute bottom-[100%]">
        {selectedFiles ? <h1>{selectedFiles.length} selected</h1> : null}
      </div>
      <button
        type="button"
        onClick={() => inputFileRef.current.click()}
        className="disabled:opacity-70 btn px-4 py-2 bg-green-400 flex items-center justify-center rounded-md hover:opacity-80 active:scale-95"
      >
        <span class="material-icons">attachment</span>
        <input
          className="hidden"
          type="file"
          multiple
          ref={inputFileRef}
          onChange={onFileChange}
        />
      </button>
      <input
        className="px-4 min-w-0 py-2 bg-gray-200 outline-none ring-0 rounded-md focus:ring-2 focus:ring-blue-400 border-gray-300 flex-grow"
        type="text"
        placeholder="Enter message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className={emojiPickerOpen ? "absolute bottom-20 left-0" : "hidden"}>
        <Picker onEmojiClick={onEmojiClick} />
      </div>
      <button
        type="button"
        onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
        className="btn px-4 py-2 bg-green-400 flex items-center justify-center rounded-md hover:opacity-80 active:scale-95"
      >
        <span className="material-icons">tag_faces</span>
      </button>

      <button
        className="btn px-4 py-2 bg-green-400 flex items-center justify-center rounded-md hover:opacity-80 active:scale-95"
        type="submit"
      >
        {filesUploading ? (
          <span className="inline-block w-4 h-4 border-2 border-gray-200 rounded-full border-t-blue-400 animate-spin"></span>
        ) : (
          <span class="material-icons">send</span>
        )}
      </button>
    </form>
  );
};

export default MessageForm;
