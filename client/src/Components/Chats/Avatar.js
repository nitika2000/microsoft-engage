import React, { useEffect, useState } from "react";

const Avatar = ({ name, w, h }) => {
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    const bgOptions = ["bg-blue-600", "bg-red-600", "bg-green-600", "bg-teal-600"];
    const randomIndex = Math.floor(Math.random() * bgOptions.length);
    setBgColor(bgOptions[randomIndex]);
  }, []);

  const initials = name
    .split(" ")
    .map((val) => val[0])
    .join("");

  return <div className={w + " " + h + " uppercase text-white rounded-full flex text-bold items-center justify-center " + bgColor}>{initials}</div>;
};

export default Avatar;
