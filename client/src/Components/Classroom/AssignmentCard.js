import React from "react";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../services/helper";

function AssignmentCard({ asssignment }) {
  return (
    <Link to={`${asssignment.assignId}`}>
      <div className="full border-2 border-gray-200 flex flex-row p-4 rounded-md my-2 m-auto hover:bg-blue-100">
        <div className="my-auto mx-3 bg-blue-700 p-1 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <div className="flex flex-col font-sans">
          <div>
            {asssignment.creatorName} posted a new assignment:
            {asssignment.title}
          </div>
          <div className="text-xs">
            Due : {formatDateTime(asssignment.deadline)}
          </div>
          <div className="text-xs">
            Created at: {formatDateTime(asssignment.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default AssignmentCard;
