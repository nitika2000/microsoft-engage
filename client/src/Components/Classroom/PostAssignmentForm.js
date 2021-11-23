import React from "react";
import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  Timestamp,
} from "@firebase/firestore";
import db from "../../services/firebase-config";
import { uploadFiles } from "../../services/helper";
import { useRef } from "react";

function PostAssignmentForm({ classDetails }) {
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [files, setFiles] = useState([]);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [grades, setGrades] = useState("");
  const [error, setError] = useState("");
  const inputFileRef = useRef();

  const resetFiles = () => {
    inputFileRef.current.value = "";
  };

  const postSubmit = () => {
    setSubmitLoader(false);
    setFiles([]);
    setDesc("");
    setDeadline("");
    setGrades("");
    setTitle("");
    resetFiles();
  };

  const onFileChange = (e) => {
    const prevFileState = files;
    const newSelectedFiles = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      newSelectedFiles.push(newFile);
    }
    const updatedList = prevFileState.concat(newSelectedFiles);
    setFiles(updatedList);
  };

  const onFileCancel = (file) => {
    var filteredFiles = files.filter((item) => item.name !== file.name);
    setFiles(filteredFiles);
  };

  const validateDate = () => {
    if (grades.length > 0 && isNaN(grades)) {
      setError("Grades should be a number");
      return false;
    } else if (deadline.length === 0) {
      setError("Deadline can't be empty");
      return false;
    } else if (deadline.length !== 0) {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      if (today.getTime() >= deadlineDate.getTime()) {
        setError("Date invalid");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    setSubmitLoader(true);
    setError("");
    const isValidate = validateDate();
    if (!isValidate) {
      setSubmitLoader(false);
      return;
    }

    const assignmentObj = {
      classId: classDetails.classId,
      title: title,
      description: desc,
      deadline: deadline.length > 0 ? new Date(deadline) : deadline,
      files: [],
      submissionList: [],
      grades: grades,
      createdAt: Timestamp.fromDate(new Date()),
      creatorName: classDetails.creatorName,
    };

    const assignRef = await addDoc(
      collection(db, "classrooms", classDetails.classId, "assignments"),
      assignmentObj,
    );

    await setDoc(assignRef, { assignId: assignRef.id }, { merge: true });

    const path = `classrooms/${classDetails.classId}/${assignRef.id}/`;

    uploadFiles(path, files).then(async (data) => {
      await setDoc(assignRef, { files: data }, { merge: true }).then(() => {
        postSubmit();
      });
    });

    const msgId = classDetails.classId;
    const msg = {
      title: title,
      deadline: deadline,
      assignId: assignRef.id,
    };
    await addDoc(collection(db, "messages", msgId, "chats"), {
      classObj: msg,
      text: "New assignment: " + title,
      from: classDetails.classId,
      to: classDetails.classId,
      createdAt: Timestamp.fromDate(new Date()),
      attachments: [],
      unread: true,
      taggedMsg: null,
      senderName: classDetails.className,
    });

    await setDoc(doc(db, "lastMsgs", msgId), {
      text: "New assignment Posted",
      from: classDetails.classId,
      to: classDetails.classId,
      users: [classDetails.classId],
      createdAt: Timestamp.fromDate(new Date()),
      unread: true,
    });
  };

  return (
    <div className="border-gray-300 border-2 p-4 m-auto rounded">
      <div className="font-bold text-center text-xl text-blue-700">
        Post Assignment
      </div>
      <label className="p-0 font-sans">
        Title <span className="text-red-500 italic ">*</span>
        <input
          className="text-sm block w-full px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded border border-blueGray-300 outline-none focus:outline-none focus:ring"
          placeholder="Title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        ></input>
      </label>

      <label className="p-0 font-sans">
        Description
        <textarea
          className="text-sm form-textarea block w-full px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded border border-blueGray-300 outline-none focus:outline-none focus:ring"
          rows="2"
          placeholder="Description..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        ></textarea>
      </label>

      <div className="flex flex-row justify-between">
        <div className="pr-2">
          <label className="p-0 font-sans">
            Grades
            <input
              type="text"
              className="text-sm block w-full px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded border border-blueGray-300 outline-none focus:outline-none focus:ring"
              placeholder="Grades"
              value={grades}
              onChange={(event) => {
                setGrades(event.target.value);
              }}
            ></input>
          </label>
        </div>
        <div>
          <div>
            <label className="p-0 font-sans">
              Deadline <span className="text-red-500 italic ">*</span>
              <input
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                type="datetime-local"
                className="text-sm bg-white block w-3full px-3 py-3 text-blueGray-600 relative rounded border border-blueGray-300 outline-none focus:outline-none focus:ring"
              />
            </label>
          </div>
        </div>
      </div>
      <label className="lg:w-1/2  w-1/2 mt-5 flex flex-row items-center px-2 py-3 rounded-md shadow-md tracking-wide uppercase border border-blue-500 cursor-pointer bg-blue-400 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        <span className="mx-2 text-sm leading-normal">Select files</span>
        <input
          multiple
          type="file"
          className="hidden"
          ref={inputFileRef}
          onChange={onFileChange}
        />
      </label>
      {files.length !== 0 ? (
        <div>
          {files.map((file) => (
            <div className="flex flex-row">
              <p className="text-gray-700 text-xs italic">{file.name}</p>
              <button
                onClick={() => onFileCancel(file)}
                type="button"
                className="inline-flex items-center justify-center hover:bg-red-700 focus:ring-indigo-500"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {error ? <p className="text-red-500 text-xs italic">{error}</p> : null}
      <button
        onClick={handleSubmit}
        disabled={title.length === 0 || submitLoader}
        className="mt-5 w-full bg-green-600 disabled:opacity-30 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
      >
        {submitLoader ? <>Posting...</> : <>Post</>}
      </button>
    </div>
  );
}

export default PostAssignmentForm;
