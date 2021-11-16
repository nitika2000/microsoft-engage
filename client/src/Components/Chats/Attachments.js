import React from "react";

const Attachments = ({ attachments, imageClick }) => {
  return (
    <div className="max-w-xs">
      {attachments.map((val) => (
        <>
          <img src={val.downloadUrl} onClick={() => imageClick(val.index)} alt={val.fileName}></img>
        </>
      ))}
    </div>
  );
};

export default Attachments;
