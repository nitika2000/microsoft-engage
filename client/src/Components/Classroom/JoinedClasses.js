import React from "react";
import ClassCard from "./ClassCard";
import { useAuth } from "../AuthContext";

const JoinedClasses = () => {
  const { currentUserData } = useAuth();
  var enrolledClasses = currentUserData.enrolledClasses;

  return (
    <div className="p-4 flex flex-wrap content-evenly gap-4">
      {enrolledClasses ? (
        enrolledClasses.map((classroom, key) => {
          return <ClassCard key={key} classroom={classroom} />;
        })
      ) : (
        <div>No class</div>
      )}
    </div>
  );
};

export default JoinedClasses;
