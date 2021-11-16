import React from "react";
import { Link } from "react-router-dom";

function AssignmentCard({ asssignment }) {
  return (
    <Link to={`${asssignment.assignId}`}>
      <div className="w-9/12 p-4 m-auto ">
        <div className="c-card block bg-white border-gray-500 border-double border-1 rounded-lg overflow-hidden">
          <div className="p-4  ">
            <h2 className=" mb-4 text-xl font-bold h-7 overflow-visible">
              {asssignment.title}
            </h2>
          </div>
        </div>
      </div>
      {/* <div className="bg-blue-200 border-r-4 m-2">
        <div>
          <p>{asssignment.description}</p>
          <p>{asssignment.deadline}</p>
          {asssignment.files
            ? asssignment.files.map((file) => (
                <div>
                  <a href={file.downloadUrl}>{file.fileName}</a>
                </div>
              ))
            : null}
        </div>
      </div> */}
    </Link>
  );
}

export default AssignmentCard;
