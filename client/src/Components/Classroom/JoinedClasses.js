import React from "react";
import ClassCard from "./ClassCard";
import db from "../../services/firebase-config";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

function JoinedClasses() {
  const [classes, setclasses] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "classrooms"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const classes = [];
      querySnapshot.forEach((doc) => {
        classes.push(doc.data());
      });
      setclasses(classes);
    });
  }, []);

  return (
    <div className="p-4 flex flex-wrap content-evenly gap-4">
      {classes.map((classroom, key) => {
        return <ClassCard key={key} classroom={classroom} />;
      })}
    </div>
  );
}

export default JoinedClasses;
