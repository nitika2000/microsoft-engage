import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { doc, getDoc } from "@firebase/firestore";
import db from "../../services/firebase-config";

function AssignmentView() {
  const searchParams = useParams();
  const classId = searchParams.classId;
  const assignId = searchParams.assignId;
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const assignRef = doc(db, "classPosts", classId, "assignments", assignId);
    const docSnap = getDoc(assignRef).then((assign) => {
      setAssignment(assign.data());
      setLoading(false);
    });
  }, []);

  return loading ? (
    <h1>Loading</h1>
  ) : assignment ? (
    <div>this is assignment view for {assignment.description}</div>
  ) : (
    <h1>Url is incorrent : 404</h1>
  );
}

export default AssignmentView;
