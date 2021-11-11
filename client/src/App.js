import "./styles/output.css";
import Nav from "./Components/navbar.jsx";
import StudentHomePage from "./pages/StudentHomePage";
import { Route, Routes } from "react-router-dom";
import ClassView from "./Components/Classroom/ClassView";
import SignUpForm from "./Components/SignUpForm";
import { AuthProvider } from "./Components/AuthContext";
import LoginForm from "./Components/LoginForm";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/" exact element={<Dashboard />} />
          <Route path="/classroom" exact element={<StudentHomePage />} />
          <Route path="classroom/:classId" element={<ClassView />} />
          <Route path="/signup" exact element={<SignUpForm />} />
          <Route path="/login" exact element={<LoginForm />} />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;
