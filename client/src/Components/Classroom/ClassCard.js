import { Link } from "react-router-dom";

function ClassCard({ classroom }) {
  return (
    <Link to={`${classroom.classCode}`}>
      <div className="px-4 py-4 w-60 h-60 bg-white border-2 border-gray-400 rounded">
        <h3 className="text-xl text-gray-800">{classroom.name}</h3>
        <div>
          <h1>Assignments</h1>
          <p>Do this</p>
          <p>Do that</p>
        </div>
        <h5 className="text-sm  text-gray-800">{classroom.admin}</h5>
      </div>
    </Link>
  );
}

export default ClassCard;
