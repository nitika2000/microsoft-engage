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
    const files = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      files.push(newFile);
    }
    setFiles(files);
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
      creatorName: classDetails.creatorName
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
      <br />
      <button onClick={handleSubmit}>
        {submitLoader ? <>Submitting</> : <>Submit</>}
      </button>
    </div>
  );
}

export default PostAssignmentForm;
