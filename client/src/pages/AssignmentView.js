import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import db from "../services/firebase-config";
import SubmissionForm from "../Components/Assignment/SubmissionForm";
import { useAuth } from "../Components/AuthContext";
import SubmissionView from "../Components/Assignment/SubmissionView";
import { formatDateTime, isTeacher } from "../services/helper";
import Loading from "../Components/Loading";
import GradingCard from "../Components/Assignment/GradingCard";
import Error from "../Components/Error";

function AssignmentView() {
  const searchParams = useParams();
  const { currentUser, currentUserData } = useAuth();
  const classId = searchParams.classId;

  const assignId = searchParams.assignId;
  const nullSubmission = {};
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [submissionList, setSubmissionList] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    const assignRef = doc(db, "classrooms", classId, "assignments", assignId);
    console.log(assignRef);
    const docSnap = getDoc(assignRef).then((assign) => {
      if (assign.data()) {
        setAssignment(assign.data());
      } else {
        setError("Assignment ID doesn't exist");
        setLoading(false);
        return;
      }
    });

    if (isTeacher(currentUserData.role)) {
      const submissionsRef = collection(db, "submissions");
      const q = query(submissionsRef, where("assignId", "==", assignId));

      const unsub = onSnapshot(q, (querySnapshot) => {
        let submissions = [];
        querySnapshot.forEach((doc) => {
          console.log("submission", doc.data());
          submissions.push(doc.data());
        });
        setSubmissionList(submissions);
      });
      return () => {
        unsub();
      };
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const submissionRef = doc(db, "submissions", assignId + currentUser.uid);
    const subSnap = getDoc(submissionRef).then((sub) => {
      if (sub.data()) {
        setSubmission(sub.data());
      } else {
        setSubmission(nullSubmission);
      }
    });
  }, [isSubmit]);

  useEffect(() => {
    if (isTeacher(currentUserData.role)) {
      if (assignment && submissionList) {
        setLoading(false);
      }
    } else {
      if (assignment && submission) {
        setLoading(false);
      }
    }
  }, [assignment, submissionList, submission]);

  console.log(submissionList);

  return loading ? (
    <Loading />
  ) : assignment ? (
    <div className="p-4">
      <div className="flex flex-row">
        <div className="bg-blue-700 rounded-full p-5 m-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>

        <div className="flex flex-col m-4 lg:max-w-1/2">
          <div className="text-blue-700 font-bold text-2xl">
            {assignment.title}
          </div>
          <div className="text-gray-600">{assignment.creatorName}</div>
          <div className="text-gray-600 text-xs">
            {assignment.grades ? assignment.grades : "No "} Points
          </div>
          <div className="text-red-600 text-xs">
            Due : {formatDateTime(assignment.deadline)}
          </div>
          <div></div>
        </div>
        {/* <div>
          <div className="text-gray-600 text-xs">
            Due : 10 December , 4:00 AM
          </div>
        </div> */}

        <div></div>
      </div>
      <div className="bg-blue-700 h-1"></div>

      <div className="flex lg:flex-row justify-between flex-col p-4 ">
        <div className="flex flex-col">
          {/* <!-- Desription --> */}
          <div className="p-4 text-sm">{assignment.description}</div>

          {/* <!--File--> */}
          {assignment.files.map((file) => {
            return (
              <a href={file.downloadUrl} download={file.downloadUrl}>
                <div className="p-4 border-2 border-gray-200 rounded-md flex flex-row my-4 w-72 overflow-hidden">
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
        </div>
        {!isTeacher(currentUserData.role) ? (
          <div className="lg:w-[240px] w-full">
            {submission &&
            JSON.stringify(submission) !== JSON.stringify(nullSubmission) ? (
              <SubmissionView submission={submission} />
            ) : (
              <SubmissionForm
                classId={classId}
                assignId={assignId}
                setIsSubmit={() => setIsSubmit(true)}
              />
            )}
          </div>
        ) : null}
      </div>

      {isTeacher(currentUserData.role) && submissionList ? (
        <>
          <div className="w-full bg-gray-300 text-center rounded-md">
            Submissions
          </div>
          {submissionList.map((submission) => (
            <GradingCard submission={submission} />
          ))}
        </>
      ) : null}
    </div>
  ) : (
    <Error error={error} />
  );
}

export default AssignmentView;
