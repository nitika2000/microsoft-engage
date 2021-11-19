import React from "react";

function ClassBanner({ classroom, isTeacher }) {
  return (
    <div className="w-9/12 py-4 m-auto">
      <div className="c-card block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-blue-700 ">
          <h2 className=" mb-4 text-3xl font-bold h-7 overflow-visible text-white">
            {classroom.className}
          </h2>
        </div>
        {isTeacher ? (
          <div className="p-2 flex flex-row justify-between text-gray-600">
            <div className="">
              <span className="font-bold">Class Code: </span>
              <span>{classroom.classCode}</span>
            </div>
            <div>
              <span className="font-bold">Enrolled Students: </span>
              <span>{classroom.enrolledStudents.length}</span>
            </div>
          </div>
        ) : null}
        <div className="p-4 flex items-center text-sm text-white bg-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>
          <span>{classroom.creatorName}</span>
        </div>
      </div>
    </div>
  );
}

export default ClassBanner;
