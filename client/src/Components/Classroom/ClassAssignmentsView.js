import React from "react";
import { useState, useEffect } from "react";
import { collection, orderBy, query, onSnapshot } from "@firebase/firestore";
import db from "../../services/firebase-config";
import AssignmentCard from "./AssignmentCard";
import Loading from "../Loading";

function ClassAssignmentsView({ classId }) {
  const [assignList, setAssignList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const assignRef = collection(db, "classrooms", classId, "assignments");
    const q = query(assignRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let assignments = [];
      querySnapshot.forEach((doc) => {
        assignments.push(doc.data());
      });
      setAssignList(assignments);
      setLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);

  return loading ? (
    <div>
      <Loading />
    </div>
  ) : (
    <div>
      {assignList.map((assignment, key) => (
        <AssignmentCard key={key} asssignment={assignment} />
      ))}
    </div>
  );
}

export default ClassAssignmentsView;
