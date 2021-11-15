/* eslint-disable default-case */
import React from "react";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getClassFromId } from "../../services/helper";
import Loading from "../Loading";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, setDoc } from "@firebase/firestore";
import db from "../../services/firebase-config";

function ClassView() {
  const searchParams = useParams();
  const [classDetails, setClassDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState("");
  const [deadline, setDeadline] = useState("");
  const [files, setFiles] = useState([]);
  const storage = getStorage();
  const [submitLoader, setSubmitLoader] = useState(false);

  useEffect(() => {
    getClassFromId(searchParams.classId).then((data) => {
      setClassDetails(data);
      setLoading(false);
    });
  }, []);

  const uploadFiles = (path) => {
    const promises = [];
    files.forEach((file) => {
      const metadata = {
        contentType: "any",
      };
      const promise = new Promise((resolve, reject) => {
        const storageRef = ref(storage, path + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.log("error occured", error);
            reject(error.code);
          },
          async () => {
            await getDownloadURL(uploadTask.snapshot.ref).then(
              (downloadURL) => {
                resolve({
                  downloadUrl: downloadURL,
                  fileName: file.name,
                });
              },
            );
          },
        );
      });
      promises.push(promise);
    });

    return Promise.all(promises);
  };

  const handleSubmit = async (e) => {
    setSubmitLoader(true);
    const assignmentObj = {
      classId: classDetails.classId,
      description: desc,
      deadline: deadline,
      files: [],
    };

    const assignRef = await addDoc(
      collection(db, "classposts", classDetails.classId, "assignments"),
      assignmentObj,
    );

    await setDoc(assignRef, { assignId: assignRef.id }, { merge: true });

    const path = `classposts/${classDetails.classId}/${assignRef.id}/`;

    uploadFiles(path).then(async (data) => {
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

  console.log("files", files);

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
