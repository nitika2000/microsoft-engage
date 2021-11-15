import React from "react";
import { useState, useEffect } from "react";
import { collection, orderBy, query, onSnapshot } from "@firebase/firestore";
import db from "../../services/firebase-config";

function ClassAssignmentsView({ classId }) {
  const [assignList, setAssignList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const assignRef = collection(db, "classPosts", classId, "assignments");
    const q = query(assignRef, orderBy("deadline", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let assignments = [];
      querySnapshot.forEach((doc) => {
        assignments.push(doc.data());
      });
      setAssignList(assignments);
      console.log("assignments are set", assignments);
      setLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);

  console.log("assignlist", assignList);
  return loading ? (
    <div>Loading.... </div>
  ) : (
    <div>
      {assignList.map((assignment) => (
        <h1>{assignment.description}</h1>
      ))}
    </div>
  );
}

export default ClassAssignmentsView;
