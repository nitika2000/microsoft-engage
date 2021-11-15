import React from "react";
import { Link } from "react-router-dom";

function AssignmentCard({ asssignment }) {
  return (
    <Link to={`${asssignment.assignId}`}>
      <div className="bg-blue-200 border-r-4 m-2">
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
      </div>
    </Link>
  );
}

export default AssignmentCard;
