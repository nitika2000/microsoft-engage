/* eslint-disable default-case */
import React from "react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getClassFromId } from "../../services/helper";
import Loading from "../Loading";
import { addDoc, collection, setDoc } from "@firebase/firestore";
import db from "../../services/firebase-config";
import { uploadFiles } from "../../services/helper";

function ClassView() {
  const searchParams = useParams();
  const [classDetails, setClassDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState("");
  const [deadline, setDeadline] = useState("");
  const [files, setFiles] = useState([]);
  const [submitLoader, setSubmitLoader] = useState(false);

  useEffect(() => {
    getClassFromId(searchParams.classId).then((data) => {
      setClassDetails(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    setSubmitLoader(true);
    const assignmentObj = {
      classId: classDetails.classId,
      description: desc,
      deadline: deadline,
      files: [],
    };

    const assignRef = await addDoc(
      collection(db, "classPosts", classDetails.classId, "assignments"),
      assignmentObj,
    );

    await setDoc(assignRef, { assignId: assignRef.id }, { merge: true });

    const path = `classPosts/${classDetails.classId}/${assignRef.id}/`;

    uploadFiles(path, files).then(async (data) => {
      console.log("data", data);
      await setDoc(assignRef, { files: data }, { merge: true }).then(() => {
        setSubmitLoader(false);
      });
    });
  };

  const onFileChange = (e) => {
    const files = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      files.push(newFile);
    }
    setFiles(files);
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <h1>This is class view</h1>
      <h1>{classDetails.className}</h1>
      <h1>{classDetails.creatorName}</h1>
      <label>
        Description
        <input
          type="text"
          placeholder="Description"
          onChange={(event) => {
            setDesc(event.target.value);
          }}
        />
      </label>
      <br />
      <label>
        Deadline
        <input
          type="date"
          placeholder="Deadline"
          onChange={(event) => {
            setDeadline(event.target.value);
          }}
        />
      </label>
      <br />
      <label>
        Select Files
        <input type="file" multiple onChange={onFileChange} />
      </label>
      <br />
      <button onClick={() => handleSubmit()}>
        {submitLoader ? <>Submitting</> : <>Submit</>}
      </button>
    </div>
  );
}

export default ClassView;
