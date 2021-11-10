function ClassCard({ classroom }) {
  return (
    <a href={classroom.classroomLink}>
      <div className="px-4 py-4 bg-white border-2 border-gray-400 rounded">
        <h3 className="text-xl text-gray-800">{classroom.classroomName}</h3>
        <div>
          <h1>Assignments</h1>
          <p>Do this</p>
          <p>Do that</p>
        </div>
        <h5 className="text-sm  text-gray-800">{classroom.admin}</h5>
      </div>
    </a>
  );
}

export default ClassCard;
