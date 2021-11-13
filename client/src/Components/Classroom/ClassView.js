import React from "react";
import { useParams } from "react-router";
import { useState } from "react";
import { getClassFromId } from "../../services/helper";
import Loading from "../Loading";

function ClassView() {
  const searchParams = useParams();
  const [classDetails, setClassDetails] = useState();
  const [loading, setLoading] = useState(true);

  getClassFromId(searchParams.classId).then((data) => {
    setClassDetails(data);
    setLoading(false);
  });

  return loading ? (
    <Loading />
  ) : (
    <div>
      <h1>This is class view</h1>
      <h1>{classDetails.className}</h1>
      <h1>{classDetails.creatorName}</h1>
    </div>
  );
}

export default ClassView;
