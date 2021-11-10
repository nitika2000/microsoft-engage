import "./styles/output.css";
import Nav from "./Components/navbar";
import JoinedClasses from "./Components/Classroom/JoinedClasses";
import { ClassList } from "./data";
import Header from "./Components/Classroom/Header";

const App = () => {
  return (
    <>
    <Nav/>
    <Header />
    <JoinedClasses classList = {ClassList} />
    </>
  );
};

export default App;