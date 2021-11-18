import { doc, getDoc, setDoc, Timestamp } from "@firebase/firestore";
import React from "react";
import { useState, useRef, useEffect } from "react";
import db from "../../services/firebase-config";
import { uploadFiles } from "../../services/helper";
import { useAuth } from "../AuthContext";

function SubmissionForm({ classId, assignId, setIsSubmit }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState("");
  const [files, setFiles] = useState([]);
  const inputFileRef = useRef();
  const [submitLoader, setSubmitLoader] = useState(false);

  const docRef = doc(db, "submissions", assignId + currentUser.uid);
  const assignRef = doc(db, "classrooms", classId, "assignments", assignId);

  const resetFiles = () => {
    inputFileRef.current.value = "";
  };

  const postSubmit = () => {
    setSubmitLoader(false);
    setFiles([]);
    setComments("");
    setIsSubmit();
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
    const solutionObj = {
      comments: comments,
      submittedBy: currentUser.uid,
      classId: classId,
      assignId: assignId,
      submittedAt: Timestamp.fromDate(new Date()),
      turnedInLate: false,
      files: [],
      grades: "",
    };

    const solRef = await setDoc(docRef, solutionObj);

    const path = `submissions/${assignId + currentUser.uid}`;

    uploadFiles(path, files).then(async (data) => {
      await setDoc(docRef, { files: data }, { merge: true }).then(() => {
        postSubmit();
      });
    });

    getDoc(assignRef).then((doc) => {
      let updatedList = doc.data().submissionList;
      updatedList.push(currentUser.uid);
      setDoc(assignRef, { submissionList: updatedList }, { merge: true });
    });
  };

  return (
    <div>
      <form>
        <div className="p-4 border-gray-200 border-2 rounded-md">
          <label className="w-full mt-5 flex flex-col items-center px-0 py-3 rounded-md shadow-md tracking-wide uppercase border border-blue-500 cursor-pointer bg-blue-400 text-white">
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
            <span className="mt-2 text-sm leading-normal">
              Select files to upload
            </span>
            <input
              ref={inputFileRef}
              multiple
              onChange={onFileChange}
              type="file"
              className="hidden"
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
          <textarea
            className="mt-5 text-sm form-textarea block w-full px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded border border-blueGray-300 outline-none focus:outline-none focus:ring"
            rows="3"
            value={comments}
            onChange={(event) => {
              setComments(event.target.value);
            }}
            placeholder="Write your comments here if any..."
          ></textarea>
          <button
            disabled={
              submitLoader || (comments.length === 0 && files.length === 0)
            }
            onClick={handleSubmit}
            className="mt-5 w-full bg-green-600 disabled:opacity-30 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            {submitLoader ? <>Submitting...</> : <>Submit</>}
          </button>
        </div>
      </form>
      {/* {isSubmited ? (
        <div>
          <h2>You have already submitted this assignment</h2>
          <h2>{submission.comments}</h2>
          <h2>{submission.submittedAt}</h2>
          {submission.files.map((file) => (
            <a href={file.downloadUrl}>{file.fileName} </a>
          ))}
        </div>
      ) : null} */}
    </div>
  );
}

export default SubmissionForm;
