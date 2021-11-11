import "./styles/output.css";
import Nav from "./Components/navbar.jsx";
import StudentHomePage from "./pages/StudentHomePage";
import { Route, Routes } from "react-router-dom";
import ClassView from "./Components/Classroom/ClassView";
import SignUpForm from "./Components/SignUpForm";
import { AuthProvider } from "./Components/AuthContext";

const App = () => {
  return (
    <div>
      <Nav />
      <AuthProvider>
        <Routes>
          <Route path="/classroom" exact element={<StudentHomePage />} />
          <Route path="classroom/:classId" element={<ClassView />} />
          <Route path="/signup" exact element={<SignUpForm />} />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;
