import React from "react";
import ClassCard from "./ClassCard";
import { useAuth } from "../AuthContext";
import { isTeacher } from "../../services/helper";
import { doc, onSnapshot } from "@firebase/firestore";
import db from "../../services/firebase-config";
import { useState, useEffect } from "react";

const JoinedClasses = () => {
  const { currentUserData } = useAuth();
  const [enrolledClasses, setEnrolledClasses] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", currentUserData.uid), (doc) => {
      setEnrolledClasses(doc.data().enrolledClasses);
    });
    return unsub;
  }, []);

  return (
    <div className="p-4 flex flex-wrap content-evenly gap-4">
      {enrolledClasses ? (
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
        <div>No class</div>
      )}
    </div>
  );
};

export default JoinedClasses;
