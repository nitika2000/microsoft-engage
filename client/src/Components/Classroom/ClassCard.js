import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
} from "@firebase/firestore";
import { Link } from "react-router-dom";
import db from "../../services/firebase-config";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { formatDateTime } from "../../services/helper";

function ClassCard({ classroom, isTeacher }) {
  const { currentUser } = useAuth();
  const [pending, setPending] = useState([]);
  const [pendingLoader, setPendingLoader] = useState(true);
  const [classroomDetails, setClassroomDetails] = useState();

  const checkSubmission = (submissionList) => {
    return (
      submissionList &&
      submissionList.length !== 0 &&
      submissionList.includes(currentUser.uid)
    );
  };

  useEffect(() => {
    setPendingLoader(true);
    if (!isTeacher) {
      const assignsRef = collection(
        db,
        "classrooms",
        classroom.classId,
        "assignments",
      );
      const q = query(assignsRef, orderBy("deadline", "asc"));

      const unsub = onSnapshot(q, (querySnapshot) => {
        const pendingAssign = [];
        querySnapshot.forEach((doc) => {
          const isSubmited = checkSubmission(doc.data().submissionList);
          const currentDate = new Date();
          const deadlineDate = new Date(doc.data().deadline.seconds * 1000);
          if (!isSubmited && deadlineDate > currentDate) {
            pendingAssign.push(doc.data());
          }
        });
        setPending(pendingAssign);
      });
      setPendingLoader(false);
      return unsub;
    } else {
      getDoc(doc(db, "classrooms", classroom.classId)).then(
        (classroomDetails) => {
          setClassroomDetails(classroomDetails.data());
          setPendingLoader(false);
        },
      );
    }
  }, []);

  return (
    <div className="w-full max-w-xs p-4">
      <div className="c-card block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative pb-5 bg-blue-200 overflow-hidden"></div>
        <Link to={`${classroom.classId}`}>
          <div className="p-4 bg-blue-100 hover:bg-blue-200 hover:underline">
            <h2 className=" mb-4 text-xl font-bold h-7 overflow-visible">
              {classroom.className}
            </h2>
          </div>
        </Link>

        <div
          className={
            isTeacher
              ? `p-4 border-t border-b text-xs h-20 text-gray-700 overflow-y-auto flex flex-col`
              : `p-4 border-t border-b text-xs h-52 text-gray-700 overflow-y-auto flex flex-col`
          }
        >
          {pendingLoader ? (
            <h1 className="text-gray-200">Loading...</h1>
          ) : (
            <div>
              {isTeacher ? (
                <div>
                  <div className="pb-2">
                    <span className="font-bold">Class Code: </span>
                    <span>{classroomDetails.classCode}</span>
                  </div>
                  <div>
                    <span className="font-bold">Enrolled Students: </span>
                    <span>{classroomDetails.enrolledStudents.length}</span>
                  </div>
                </div>
              ) : (
                pending.map((assign) => {
                  return (
                    <Link
                      key={assign.assignId}
                      to={`${classroom.classId}/${assign.assignId}`}
                    >
                      <div className="flex flex-col p-2 hover:underline">
                        <div>{assign.title}</div>
                        <div>Deadline : {formatDateTime(assign.deadline)}</div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>
        <div className="p-4 flex items-center text-sm text-gray-600 bg-blue-100">
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

export default ClassCard;
