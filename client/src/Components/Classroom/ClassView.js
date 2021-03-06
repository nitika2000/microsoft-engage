import React from "react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getClassFromId, isTeacher } from "../../services/helper";
import Loading from "../Loading";
import ClassBanner from "./ClassBanner";
import PostAssignmentForm from "./PostAssignmentForm";
import ClassAssignmentsView from "./ClassAssignmentsView";
import { useAuth } from "../AuthContext";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import db from "../../services/firebase-config";
import PendingAssignmentView from "./PendingAssignmentView";
import StudentList from "./StudentList";

function ClassView() {
  const searchParams = useParams();
  const classId = searchParams.classId;
  const [classDetails, setClassDetails] = useState();
  const [loading, setLoading] = useState(true);
  const { currentUserData } = useAuth();
  const [pending, setPending] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [studentTab, setStudentTab] = useState(false);

  useEffect(() => {
    getClassFromId(searchParams.classId).then((data) => {
      setClassDetails(data);
      if (!isTeacher(currentUserData.role)) {
        setPendingAssignments();
      } else {
        getEnrolledStudents(data).then(() => setLoading(false));
      }
    });
  }, []);

  const getEnrolledStudents = async (data) => {
    const enrolled = data.enrolledStudents;
    var enrolledStudents = [];
    enrolled.forEach((studentId) => {
      getDoc(doc(db, "users", studentId)).then((student) => {
        enrolledStudents.push({
          name: student.data().uname,
          email: student.data().email,
        });
      });
    });
    setStudentList(enrolledStudents);
  };

  const checkSubmission = (submissionList) => {
    return (
      submissionList &&
      submissionList.length !== 0 &&
      submissionList.includes(currentUserData.uid)
    );
  };

  const setPendingAssignments = () => {
    setLoading(true);
    const assignsRef = collection(db, "classrooms", classId, "assignments");
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
    setLoading(false);
    return unsub;
  };

  const activeState = " text-white bg-gray-500";

  return loading ? (
    <Loading />
  ) : (
    <div>
      <ClassBanner
        classroom={classDetails}
        isTeacher={isTeacher(currentUserData.role)}
      />
      {isTeacher(currentUserData.role) ? (
        <div className="my-1 p-1 border-b-2 w-9/12 m-auto flex flex-row justify-center">
          <div
            onClick={() => setStudentTab(false)}
            className={`p-2 cursor-pointer rounded-sm hover:bg-gray-500 hover:text-white${
              studentTab ? "" : activeState
            }`}
          >
            Class View
          </div>
          <div
            onClick={() => setStudentTab(true)}
            className={`p-2 cursor-pointer rounded-sm hover:bg-gray-500 hover:text-white${
              !studentTab ? "" : activeState
            }`}
          >
            Enrolled Student
          </div>
        </div>
      ) : null}

      {studentTab ? (
        <div className="w-full">
          <StudentList studentList={studentList} />
        </div>
      ) : (
        <div className="flex lg:flex-row flex-col mx-auto w-9/12">
          {isTeacher(currentUserData.role) ? (
            <div className="lg:w-1/2 w-full lg:p-2">
              <PostAssignmentForm classDetails={classDetails} />
            </div>
          ) : (
            <div className="lg:w-1/4 w-full lg:p-2">
              <PendingAssignmentView pending={pending} />
            </div>
          )}
          <div className="w-full">
            <ClassAssignmentsView classId={classDetails.classId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassView;
