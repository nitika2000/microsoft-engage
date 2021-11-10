import "./styles/output.css";
import Nav from "./Components/navbar";
import JoinedClasses from "./Components/Classroom/JoinedClasses";
import { ClassList } from "./data";

const App = () => {
  return (
    <>
    <Nav/>
    <JoinedClasses classList = {ClassList}/>
    </>
  );
};

export default App;