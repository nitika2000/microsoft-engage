import React from "react";
import { formatDateTime } from "../../services/helper";

function SubmissionView({ submission }) {
  return (
    <div>
      <div className="p-4 border-gray-200 border-2 rounded-md">
        {submission.turnedInLate ? (
          <div className="text-sm italic text-red-700">Turned in Late</div>
        ) : null}
        <div className="w-full flex flex-col items-center px-0 py-2 rounded-md shadow-md tracking-wide uppercase border border-green-600 bg-green-600 text-white">
          <span className="mt-2 text-sm font-bold leading-normal">
            Your work
          </span>
        </div>
        <div>
          <p className="text-gray-600 italic pt-4">
            <span className="font-bold text-gray-600">Submitted At: </span>
            {formatDateTime(submission.submittedAt)}
          </p>
        </div>
        {submission.comments && submission.comments.length > 0 ? (
          <div>
            <p className="text-gray-600 italic pt-4">
              <span className="font-bold text-gray-600">Your Comments: </span>
              {submission.comments}
            </p>
          </div>
        ) : null}

        {submission.files && submission.files.length > 0
          ? submission.files.map((file) => {
              return (
                <a href={file.downloadUrl} download={file.downloadUrl}>
                  <div className="p-3 hover:bg-blue-200 border-2 border-gray-200 rounded-md flex flex-row my-4 w-full overflow-hidden">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="px-4">{file.fileName}</div>
                  </div>
                </a>
              );
            })
          : null}
        <div>
          <p className="text-gray-600 italic pt-4">
            <span className="font-bold text-gray-600">Grades: </span>
            {submission.grades && submission.grades.length > 0 ? (
              <span className="font-bold text-gray-600">
                {submission.grades}
              </span>
            ) : (
              <span className="text-xs text-gray-600">Not graded yet </span>
            )}
            {submission.feedback && submission.feedback.length > 0 ? (
              <div>
                <span className="font-bold text-gray-600">
                  Feedback by teacher : {submission.feedback}
                </span>
              </div>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubmissionView;
