import React, { useState } from "react";
import ClassCard from "./ClassCard";
import { useAuth } from "../AuthContext";
import { getCurrentUserData } from "../../services/helper";

const JoinedClasses = () => {
  const [enrolledClasses, setEnrolledClasses] = useState();

  const currentUserData = async (currentUser) => {
    const data = await getCurrentUserData(currentUser);
    return data;
  };
  const { currentUser } = useAuth();
  const user = currentUserData(currentUser);
  user.then((data) => setEnrolledClasses(data.enrolledClasses));
  console.log("enrolled classes = ", enrolledClasses);
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
