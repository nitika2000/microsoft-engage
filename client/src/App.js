import "./styles/output.css";
import Nav from "./Components/navbar.jsx";
import { Route, Routes } from "react-router-dom";
import ClassView from "./Components/Classroom/ClassView";
import SignUpForm from "./Components/SignUpForm";
import { AuthProvider } from "./Components/AuthContext";
import LoginForm from "./Components/LoginForm";
import ClassesHomePage from "./pages/ClassroomPage";
import { RequireAuth } from "./Components/RequireAuth";
import ChatPage from "./pages/ChatPage";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route
            path="/"
            exact
            element={
              <RequireAuth>
                <ChatPage />
              </RequireAuth>
            }
          />
          <Route
            path="/classroom"
            exact
            element={
              <RequireAuth>
                <ClassesHomePage />
              </RequireAuth>
            }
          />
          <Route
            path="classroom/:classId"
            element={
              <RequireAuth>
                <ClassView />
              </RequireAuth>
            }
          />
          <Route path="/signup" exact element={<SignUpForm />} />
          <Route path="/login" exact element={<LoginForm />} />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;
