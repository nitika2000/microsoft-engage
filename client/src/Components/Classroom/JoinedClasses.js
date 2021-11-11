import React from "react";
import ClassCard from "./ClassCard";
import db from "../../services/firebase-config";
import { collection, query, onSnapshot } from "firebase/firestore";

async function getClasses() {
  const q = query(collection(db, "classrooms"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const classes = [];
    querySnapshot.forEach((doc) => {
      classes.push(doc.data().name);
    });
    console.log(classes.join(", "));
  });
}

function JoinedClasses({ classes }) {
  getClasses();

  return (
    <div className="p-4 flex flex-wrap content-evenly gap-4">
      {classes.map((classroom, key) => {
        return <ClassCard key={key} classroom={classroom} />;
      })}
    </div>
  );
}

export default JoinedClasses;
