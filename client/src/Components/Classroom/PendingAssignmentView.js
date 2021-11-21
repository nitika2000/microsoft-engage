import React from "react";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../services/helper";

function PendingAssignmentView({ pending }) {
  return (
    <div className="w-full border-2 border-gray-200 flex flex-col p-4 rounded-md h-52 mx-auto">
      <div className="my-auto mx-3 bg-gray-100 p-1 rounded-full flex-row flex">
        <div className="p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="red"
            viewBox="0 0 24 24"
            stroke="red"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
            />
          </svg>
        </div>
        <div className="p-1 text-xs text-red-600">Pending Assignments</div>
      </div>
      <div className="flex flex-col h-52 font-sans overflow-y-auto text-sm">
        {pending.map((assign) => {
          return (
            <Link to={`${assign.assignId}`}>
              <div className="flex flex-col py-3 hover:underline">
                <div>{assign.title}</div>
                <div className="text-xs">
                  Due : {formatDateTime(assign.deadline)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default PendingAssignmentView;
