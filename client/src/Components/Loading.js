import React from "react";
import ReactLoading from "react-loading";

function Loading() {
  return (
    <div class="flex h-screen">
      <div class="m-auto">
        <ReactLoading type="bars" color="#000" height={50} width={50} />
      </div>
    </div>
  );
}

export default Loading;
