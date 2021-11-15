import React from "react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getClassFromId } from "../../services/helper";
import Loading from "../Loading";
import ClassBanner from "./ClassBanner";
import PostAssignmentForm from "./PostAssignmentForm";
import ClassAssignmentsView from "./ClassAssignmentsView";

function ClassView() {
  const searchParams = useParams();
  const [classDetails, setClassDetails] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClassFromId(searchParams.classId).then((data) => {
      setClassDetails(data);
      setLoading(false);
    });
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div>
      <ClassBanner classroom={classDetails} />

      <PostAssignmentForm classDetails={classDetails} />

      <ClassAssignmentsView classId={classDetails.classId} />
    </div>
  );
}

export default ClassView;
