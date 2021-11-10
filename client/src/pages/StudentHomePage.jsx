import Header from "../Components/Classroom/Header.js";
import JoinedClasses from "../Components/Classroom/JoinedClasses.js";
import { ClassList } from "../data";

function StudentHomePage() {
  return (
    <div>
      <Header />
      <JoinedClasses classes={ClassList} />
    </div>
  );
}

export default StudentHomePage;
