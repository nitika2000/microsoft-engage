import React from 'react'

function ClassCard(props) {
    var classroom = props.classroom;
    return (
        <a href={classroom.classroomLink}>
            <div className="px-4 py-4 bg-white border-2 border-gray-400 rounded">
                    <h3 className="text-2xl text-center text-gray-800">{classroom.classroomName}</h3>
                    <h5 className="text-2xl text-center text-gray-800">{classroom.admin}</h5>
            </div>
        </a>
    )
}

export default ClassCard
