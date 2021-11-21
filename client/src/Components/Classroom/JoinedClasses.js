import React from "react";
import ClassCard from "./ClassCard";
import { useAuth } from "../AuthContext";
import { isTeacher } from "../../services/helper";
import { doc, onSnapshot } from "@firebase/firestore";
import db from "../../services/firebase-config";
import { useState, useEffect } from "react";
import Loading from "../Loading";

const JoinedClasses = () => {
  const { currentUserData } = useAuth();
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(doc(db, "users", currentUserData.uid), (doc) => {
      setEnrolledClasses(doc.data().enrolledClasses);
    });
    setLoading(false);
    return unsub;
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="p-4 flex flex-wrap content-evenly gap-4">
      {enrolledClasses && enrolledClasses.length != 0 ? (
        enrolledClasses.map((classroom, key) => {
          return (
            <ClassCard
              key={key}
              classroom={classroom}
              isTeacher={isTeacher(currentUserData.role)}
            />
          );
        })
      ) : (
        <p className="pt-5 text-gray-400 text-xs italic">No clases to show.</p>
      )}
    </div>
  );
};

export default JoinedClasses;
