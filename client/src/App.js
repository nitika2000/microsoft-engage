import "./styles/output.css";
import Nav from "./Components/navbar.jsx";
import StudentHomePage from "./pages/StudentHomePage";
import { Route, Routes } from "react-router-dom";
import ClassView from "./Components/Classroom/ClassView";
import SignUpForm from "./Components/SignUpForm";
import { useAuth } from "./Components/AuthContext";
import LoginForm from "./Components/LoginForm";
import Dashboard from "./pages/Dashboard";
import Loading from "./Components/Loading";

const App = () => {
  const { currentUserData } = useAuth();
  return (
    <div>
      <Nav />
      {currentUserData ? (
        <Routes>
          <Route path="/" exact element={<Dashboard />} />
          <Route path="/classroom" exact element={<StudentHomePage />} />
          <Route path="classroom/:classId" element={<ClassView />} />
          <Route path="/signup" exact element={<SignUpForm />} />
          <Route path="/login" exact element={<LoginForm />} />
        </Routes>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default App;
