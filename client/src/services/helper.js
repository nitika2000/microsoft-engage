/* eslint-disable default-case */
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  limit,
} from "@firebase/firestore";
import db from "./firebase-config";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export const getSlug = (length) => {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getCurrentUserData = async (currentUser) => {
  const docRef = doc(db, "users", currentUser.uid);
  const docSnap = await getDoc(docRef);
  const user = docSnap.data();
  return user;
};

export const getClassFromId = async (classId) => {
  const docRef = doc(db, "classrooms", classId);
  const docSnap = await getDoc(docRef);
  const classObj = docSnap.data();
  return classObj;
};

export const getClassFromCode = async (classCode) => {
  const q = query(
    collection(db, "classrooms"),
    where("classCode", "==", classCode),
    limit(1),
  );

  const querySnapshot = await getDocs(q);
  var classObj = null;
  querySnapshot.forEach((doc) => {
    classObj = doc.data();
  });
  return classObj;
};

export const isTeacher = (role) => {
  return role === "Teacher";
};

export const getMessageId = (currentUser, selectedUser) => {
  console.log(currentUser, selectedUser);
  const user1 = currentUser.uid;
  const user2 = selectedUser.uid;

  const msgId = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
  return msgId;
};

export function truncate(str, n, useWordBoundary) {
  if (str.length <= n) {
    return str;
  }
  const subString = str.substr(0, n - 1);
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
}

export const uploadFiles = (path, files) => {
  const storage = getStorage();
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
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve({
              downloadUrl: downloadURL,
              fileName: file.name,
            });
          });
        },
      );
    });
    promises.push(promise);
  });

  return Promise.all(promises);
};
