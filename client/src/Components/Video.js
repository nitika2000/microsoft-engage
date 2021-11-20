import React, { useEffect } from "react";

const Video = ({ stream, muted = false }) => {
  const elemRef = React.createRef();

  useEffect(() => {
    if (elemRef.current) {
      elemRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <video ref={elemRef} muted={muted} autoPlay playsInline></video>
    </div>
  );
};

export default Video;
