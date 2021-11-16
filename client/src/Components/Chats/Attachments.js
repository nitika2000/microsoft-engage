import React from "react";

const Attachments = ({ attachments, imageClick }) => {
  return (
    <div className={`max-w-xs space-y-1`}>
      {attachments.map((val, index) => {
        if (val.contentType && val.contentType.includes("image")) {
          return <img key={val.fileName + index} className="h-32" src={val.downloadUrl} onClick={() => imageClick(val.index)} alt={val.fileName}></img>;
        } else {
          return (
            <div key={val.fileName + index} className="flex border border-gray-400 text-gray-800 rounded-sm py-2 px-2 gap-1 items-center">
              <span class="material-icons text-gray-600">file_present</span>
              {val.fileName}
              <a className="flex items-center" href={val.downloadUrl} download={val.downloadUrl}>
                <span class="material-icons hover:bg-gray-200 p-1 rounded-full text-gray-600">file_download</span>
              </a>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Attachments;
