import "./styles/output.css";
import Nav from "./Components/navbar.jsx";
import StudentHomePage from "./pages/StudentHomePage";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/classroom" exact element={<StudentHomePage />} />
      </Routes>
    </div>
  );
};

export default App;
