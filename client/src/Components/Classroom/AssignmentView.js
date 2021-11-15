import React from "react";
import { useParams } from "react-router";

function AssignmentView() {
  const searchParams = useParams();
  const classId = searchParams.classId;
  const assignId = searchParams.assignId;
  return (
    <div>
      this is assignment view for {classId} {assignId}
    </div>
  );
}

export default AssignmentView;
