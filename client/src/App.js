import "./styles/output.css";
import Nav from "./Components/navbar.jsx";
import StudentHomePage from "./pages/StudentHomePage";
import { Route, Routes } from "react-router-dom";
import ClassView from "./Components/Classroom/ClassView";
import SignUpForm from "./Components/SignUpForm";

const App = () => {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/classroom" exact element={<StudentHomePage />} />
        <Route path="classroom/:classId" element={<ClassView />} />
        <Route path="/signup" exact element={<SignUpForm/>} />
      </Routes>
    </div>
  );
};

export default App;
