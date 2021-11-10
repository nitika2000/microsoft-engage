import React from "react";
import { ClassList } from "../../data";
import Header from "./Header";
import JoinedClasses from "./JoinedClasses";

function Classroom() {
  return (
    <div>
      <Header />
      <JoinedClasses classList={ClassList} />
    </div>
  );
}
export default Classroom;
