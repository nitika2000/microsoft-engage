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

function ClassView() {
  const searchParams = useParams();
  const [classDetails, setClassDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState();
  const storage = getStorage();

  useEffect(() => {
    getClassFromId(searchParams.classId).then((data) => {
      setClassDetails(data);
      setLoading(false);
    });
  }, []);

  const uploadFiles = () => {
    console.log("inside upload");
    if (files.length !== 0) {
      console.log("here it is");
      const metadata = {
        contentType: "any",
      };

      const storageRef = ref(storage, "images/" + files[0].name);
      const uploadTask = uploadBytesResumable(storageRef, files[0], metadata);

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
          console.log("error occured");
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        },
      );
    }
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
        Select Files
        <input type="file" multiple onChange={onFileChange} />
      </label>
      <button onClick={uploadFiles}>Upload</button>
    </div>
  );
}

export default ClassView;
