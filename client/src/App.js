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
import AssignmentView from "./pages/AssignmentView";
import Profile from "./Components/Profile";
import MeetPage from "./pages/MeetPage";
import { VideoCallProvider } from "./services/VideoCallService";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <VideoCallProvider>
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
              path="/profile"
              exact
              element={
                <RequireAuth>
                  <Profile />
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
            <Route
              path="classroom/:classId/:assignId"
              element={
                <RequireAuth>
                  <AssignmentView />
                </RequireAuth>
              }
            />
            <Route path="/signup" exact element={<SignUpForm />} />
            <Route path="/login" exact element={<LoginForm />} />
            <Route path="/meet/:id" exact element={<MeetPage />} />
          </Routes>
        </VideoCallProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
