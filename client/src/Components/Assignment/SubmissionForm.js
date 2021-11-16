import { doc, getDoc, setDoc, Timestamp } from "@firebase/firestore";
import React from "react";
import { useState, useRef, useEffect } from "react";
import db from "../../services/firebase-config";
import { uploadFiles } from "../../services/helper";
import { useAuth } from "../AuthContext";

function SubmissionForm({ classId, assignId }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState("");
  const [files, setFiles] = useState([]);
  const inputFileRef = useRef();
  const [loading, setLoading] = useState(true);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [submission, setSubmission] = useState();
  const [isSubmited, setIsSubmitted] = useState(false);

  const docRef = doc(
    db,
    "classPosts",
    classId,
    "assignments",
    assignId,
    "submissions",
    currentUser.uid,
  );
  const assignRef = doc(db, "classPosts", classId, "assignments", assignId);

  const getSubmission = () => {
    setLoading(true);
    getDoc(docRef).then((doc) => {
      if (doc.data()) {
        setSubmission(doc.data());
        setIsSubmitted(true);
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    getSubmission();
  }, []);

  const resetFiles = () => {
    inputFileRef.current.value = "";
  };

  const postSubmit = () => {
    setSubmitLoader(false);

    setFiles([]);
    setComments("");
    setIsSubmitted(true);
    resetFiles();
    getSubmission();
  };

  const onFileChange = (e) => {
    const files = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      files.push(newFile);
    }
    setFiles(files);
  };

  const handleSubmit = async (e) => {
    setSubmitLoader(true);
    const solutionObj = {
      comments: comments,
      submittedBy: currentUser.uid,
      submittedAt: Timestamp.fromDate(new Date()),
      files: [],
    };

    const solRef = await setDoc(docRef, solutionObj);

    const path = `classPosts/${classId}/${assignId}/submissions/${currentUser.uid}`;

    uploadFiles(path, files).then(async (data) => {
      await setDoc(docRef, { files: data }, { merge: true }).then(() => {
        postSubmit();
      });
    });

    getDoc(assignRef).then((data) => {
      console.log("now I am submittiing");
      let updatedList = data.submissionList.push(currentUser.uid);
      setDoc(assignRef, { submissionList: updatedList }, { merge: true });
    });
  };

  console.log(submission);

  return (
    <div>
      <div>
        <label>
          Comments
          <input
            type="text"
            value={comments}
            placeholder="Description"
            onChange={(event) => {
              setComments(event.target.value);
            }}
          />
        </label>
        <br />

        <label>
          Select Files
          <input
            type="file"
            multiple
            ref={inputFileRef}
            onChange={onFileChange}
          />
        </label>
        <br />
        <button onClick={handleSubmit}>
          {submitLoader ? <>Submitting</> : <>Submit</>}
        </button>
      </div>
      {isSubmited ? (
        <div>
          <h2>You have already submitted this assignment</h2>
          <h2>{submission.comments}</h2>
          {/* <h2>{submission.submittedAt}</h2> */}
          {submission.files.map((file) => (
            <a href={file.downloadUrl}>{file.fileName} </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default SubmissionForm;
