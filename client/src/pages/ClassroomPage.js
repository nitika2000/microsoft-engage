import React from "react";
import { useAuth } from "../Components/AuthContext";
import Loading from "../Components/Loading";
import Header from "../Components/Classroom/Header";
import JoinedClasses from "../Components/Classroom/JoinedClasses";

function ClassesHomePage() {
  const { currentUserData } = useAuth();

  return currentUserData ? (
    <div>
      <Header />
      <JoinedClasses />
    </div>
  ) : (
    <Loading />
  );
}

export default ClassesHomePage;
