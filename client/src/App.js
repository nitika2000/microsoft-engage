import "./styles/output.css";
import Nav from "./Components/navbar";
import Classroom from "./Components/Classroom/Classroom";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/classroom" exact element={<Classroom />} />
      </Routes>
    </div>
  );
};

export default App;
