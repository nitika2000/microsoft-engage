import React from "react";

function ClassBanner({ classroom }) {
  return (
    <div className="bg-purple-600 bg-opacity-50">
      <div className="flex">
        <div>
          <p className="font-bold">{classroom.className}</p>
          <p className="text-sm">{classroom.creatorName}</p>
        </div>
      </div>
    </div>
  );
}

export default ClassBanner;
