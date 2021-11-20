import React from "react";
import ReactLoading from "react-loading";

function Loading() {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <ReactLoading type="bars" color="#000" height={50} width={50} />
      </div>
    </div>
  );
}

export default Loading;
