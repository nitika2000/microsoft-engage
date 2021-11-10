import React from "react";
import ClassCard from "./ClassCard";

function JoinedClasses({ classes }) {
  return (
    <div className="p-4 flex flex-wrap content-evenly gap-4">
      {classes.map((classroom, key) => {
        return <ClassCard key={key} classroom={classroom} />;
      })}
    </div>
  );
}

export default JoinedClasses;
