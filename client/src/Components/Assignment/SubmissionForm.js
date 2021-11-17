import { doc, getDoc, setDoc, Timestamp } from "@firebase/firestore";
import React from "react";
import { useState, useRef, useEffect } from "react";
import db from "../../services/firebase-config";
import { uploadFiles } from "../../services/helper";
import { useAuth } from "../AuthContext";

function SubmissionForm({ classId, assignId }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState("");
  const [files, setFiles] = useState([]);
  const inputFileRef = useRef();
  const [loading, setLoading] = useState(true);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [submission, setSubmission] = useState();
  const [isSubmited, setIsSubmitted] = useState(false);

  const docRef = doc(
    db,
    "classrooms",
    classId,
    "assignments",
    assignId,
    "submissions",
    currentUser.uid,
  );
  const assignRef = doc(db, "classrooms", classId, "assignments", assignId);

  const getSubmission = () => {
    setLoading(true);
    getDoc(docRef).then((doc) => {
      if (doc.data()) {
        setSubmission(doc.data());
        setIsSubmitted(true);
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    getSubmission();
  }, []);

  const resetFiles = () => {
    inputFileRef.current.value = "";
  };

  const postSubmit = () => {
    setSubmitLoader(false);

    setFiles([]);
    setComments("");
    setIsSubmitted(true);
    resetFiles();
    getSubmission();
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
    const solutionObj = {
      comments: comments,
      submittedBy: currentUser.uid,
      submittedAt: Timestamp.fromDate(new Date()),
      files: [],
    };

    const solRef = await setDoc(docRef, solutionObj);

    const path = `classrooms/${classId}/${assignId}/submissions/${currentUser.uid}`;

    uploadFiles(path, files).then(async (data) => {
      await setDoc(docRef, { files: data }, { merge: true }).then(() => {
        postSubmit();
      });
    });

    getDoc(assignRef).then((data) => {
      let updatedList = data.submissionList.push(currentUser.uid);
      setDoc(assignRef, { submissionList: updatedList }, { merge: true });
    });
  };

  console.log(files);

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
                <p className="text-gray-700 text-xs italic">{file.name}</p>
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
