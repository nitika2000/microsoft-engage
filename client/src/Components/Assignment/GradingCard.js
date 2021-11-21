import React from "react";
import { formatDateTime } from "../../services/helper";
import { useState } from "react";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import db from "../../services/firebase-config";

function GradingCard({ submission }) {
  console.log(submission);
  const [feedback, setFeedback] = useState();
  const [grades, setGrades] = useState();
  const [submitLoader, setSubmitLoader] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitLoader(true);
    setDoc(
      doc(db, "submissions", submission.assignId + submission.submittedBy),
      { feedback: feedback, grades: grades },
      { merge: true },
    ).then(() => setSubmitLoader(false));
  };

  return (
    <div className="w-9/12 border-2 border-gray-200 flex flex-row p-4 rounded-md my-2 m-auto hover:border-blue-600 hover:border-2 hover:border-opacity-25">
      <div className="my-auto mx-3 bg-blue-700 p-2 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      </div>
      <div className="flex flex-col font-sans w-full">
        <div>{submission.studentName}</div>
        <div className="text-xs">
          Submitted At : {formatDateTime(submission.submittedAt)}
        </div>

        <div className="text-sm pt-2">
          <span className="font-bold">Comments :</span>
          <span className="text-sm italic">
            {submission.comments && submission.comments.length >= 0
              ? submission.comments
              : " No comments by student"}
          </span>
        </div>
        {submission.files.map((file) => {
          return (
            <a href={file.downloadUrl} download={file.downloadUrl}>
              <div className="p-3 hover:bg-blue-200 border-2 w-1/2 border-gray-200 rounded-md flex flex-row my-4 overflow-hidden">
                <div>
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="px-4">{file.fileName}</div>
              </div>
            </a>
          );
        })}
        <div className="flex flex-row justify-between">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="mt-5 text-sm form-textarea block w-full px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded border border-blueGray-300 outline-none focus:outline-none focus:ring"
            rows="3"
            placeholder="Write your here here if any..."
          />

          <div className="mx-4 flex flex-col">
            <input
              value={grades}
              onChange={(e) => setGrades(e.target.value)}
              placeholder="Grades Alloted"
              className="mt-5 text-sm block w-full px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded border border-blueGray-300 outline-none focus:outline-none focus:ring"
            />
            <button
              className="bg-blue-500 w-full mt-1 disabled:opacity-30 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSubmit}
              disabled={!(grades || feedback) || submitLoader}
            >
              {submitLoader ? <span>Wait...</span> : <span>Done</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradingCard;
