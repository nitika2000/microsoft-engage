import React from "react";

function StudentList({ studentList }) {
  return (
    <div className="w-9/12 m-auto">
      <table className="w-full text-left border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="p-2">S.No.</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {studentList && studentList.length > 0
            ? studentList.map((student, index) => {
                return (
                  <tr className="border-t border border-gray-400">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{student.email}</td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
