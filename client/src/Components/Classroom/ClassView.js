import React from "react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getClassFromId, isTeacher } from "../../services/helper";
import Loading from "../Loading";
import ClassBanner from "./ClassBanner";
import PostAssignmentForm from "./PostAssignmentForm";
import ClassAssignmentsView from "./ClassAssignmentsView";
import { useAuth } from "../AuthContext";

function ClassView() {
  const searchParams = useParams();
  const [classDetails, setClassDetails] = useState();
  const [loading, setLoading] = useState(true);

  const { currentUserData } = useAuth();

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
      {isTeacher(currentUserData.role) ? (
        <PostAssignmentForm classDetails={classDetails} />
      ) : null}

      <ClassAssignmentsView classId={classDetails.classId} />
    </div>
  );
}

export default ClassView;
