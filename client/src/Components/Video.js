import React, { useEffect } from "react";

const Video = ({ stream }) => {
  const elemRef = React.createRef();

  useEffect(() => {
    if (elemRef.current) {
      elemRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <video ref={elemRef} autoPlay playsInline></video>
    </div>
  );
};

export default Video;
