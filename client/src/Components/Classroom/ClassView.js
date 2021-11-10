import React from "react";
import { useParams } from "react-router";

function ClassView() {
  let searchParams = useParams();
  console.log(searchParams);

  return (
    <div>
      <h1>This is class view of classID {searchParams.classId}</h1>
    </div>
  );
}

export default ClassView;
