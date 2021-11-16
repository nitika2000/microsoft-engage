import {
  collection,
  getDoc,
  onSnapshot,
  query,
  where,
  doc,
  getDocs,
  orderBy,
} from "@firebase/firestore";
import { Link } from "react-router-dom";
import db from "../../services/firebase-config";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

function ClassCard({ classroom, isTeacher }) {
  const { currentUser } = useAuth();
  const [pending, setPending] = useState([]);
  const [pendingLoader, setPendingLoader] = useState(true);

  console.log(currentUser);

  const checkSubmission = (submissionList) => {
    return (
      submissionList &&
      submissionList.length !== 0 &&
      submissionList.includes(currentUser.uid)
    );
  };

  useEffect(() => {
    if (!isTeacher) {
      setPendingLoader(true);
      const assignsRef = collection(
        db,
        "classPosts",
        classroom.classId,
        "assignments",
      );
      const q = query(assignsRef, orderBy("deadline", "asc"));

      const unsub = onSnapshot(q, (querySnapshot) => {
        const pendingAssign = [];
        querySnapshot.forEach((doc) => {
          const isSubmited = checkSubmission(doc.data().submissionList);
          if (!isSubmited) {
            pendingAssign.push(doc.data());
          }
        });
        setPending(pendingAssign);
      });
      setPendingLoader(false);
      return unsub;
    }
  }, []);

  console.log("pending is set", pending, classroom.classId, pending.length);
  return (
    <Link to={`${classroom.classId}`}>
      <div className="w-72  rounded overflow shadow-lg ">
        <div className="px-6 py-4 w-full bg-yellow-100 grid grid-cols-1 divide-y divide-yellow-500">
          <div>
            <div className="font-bold text-xl mb-2  text-center p-3">
              {classroom.className}
            </div>
          </div>
          <div className="py-4">
            {pendingLoader ? (
              <h1>Loading</h1>
            ) : (
              <div>
                {pending.map((assign) => {
                  return <h1>{assign.deadline}</h1>;
                })}
              </div>
            )}
          </div>

          <div className="py-2 ">
            <p>{classroom.creatorName}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ClassCard;
