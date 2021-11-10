import React from 'react'
import ClassCard from './ClassCard';

function JoinedClasses(props) {
    return (
            <div className="flex flex-wrap content-evenly gap-4">
                {
                    props.classList.map((classroom, key) => {
                        return (<ClassCard key={key} classroom={classroom} />)
                    })
                }
            </div>
    );
};

export default JoinedClasses;
