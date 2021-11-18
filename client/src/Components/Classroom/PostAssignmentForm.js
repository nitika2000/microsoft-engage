import React from "react";
import { useState } from "react";
import { addDoc, collection, setDoc, Timestamp } from "@firebase/firestore";
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

  const handleSubmit = async (e) => {
    setSubmitLoader(true);
    const assignmentObj = {
      classId: classDetails.classId,
      title: title,
      description: desc,
      deadline: deadline,
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
      console.log("data", data);
      await setDoc(assignRef, { files: data }, { merge: true }).then(() => {
        postSubmit();
      });
    });
  };

  return (
    <div>
      <label>
        Title
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </label>
      <label>
        Description
        <input
          type="text"
          value={desc}
          placeholder="Description"
          onChange={(event) => {
            setDesc(event.target.value);
          }}
        />
      </label>
      <br />
      <label>
        Grades
        <input
          type="text"
          value={grades}
          placeholder="Grades"
          onChange={(event) => {
            setGrades(event.target.value);
          }}
        />
      </label>
      <label>
        Deadline
        <input
          type="datetime-local"
          value={deadline}
          placeholder="Deadline"
          onChange={(event) => {
            setDeadline(event.target.value);
          }}
        />
      </label>
      <br />
      <label>
        Select Files
        <input
          type="file"
          multiple
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
                class="inline-flex items-center justify-center hover:bg-red-700 focus:ring-indigo-500"
              >
                <span class="sr-only">Close menu</span>
                <svg
                  class="h-3 w-3"
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
      <br />
      <button onClick={handleSubmit}>
        {submitLoader ? <>Submitting</> : <>Submit</>}
      </button>
    </div>
  );
}

export default PostAssignmentForm;
