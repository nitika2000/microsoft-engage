/* eslint-disable default-case */
import { doc, getDoc, getDocs, collection, query, where, limit } from "@firebase/firestore";
import db from "./firebase-config";

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import moment from "moment";

export const getSlug = async (length) => {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  var isFound = false;
  while (!isFound) {
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    // eslint-disable-next-line no-loop-func
    getClassFromCode(result).then((obj) => {
      if (obj) {
        result = "";
      } else {
        isFound = true;
      }
    });
    console.log("class code", result);
    return result;
  }
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
  const q = query(collection(db, "classrooms"), where("classCode", "==", classCode), limit(1));

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
  return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(" ")) : subString) + "...";
}

export const uploadFiles = (path, files) => {
  const storage = getStorage();
  const promises = [];
  files.forEach((file) => {
    const metadata = {
      contentType: file.type,
    };
    const promise = new Promise((resolve, reject) => {
      const storageRef = ref(storage, path + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
              contentType: file.type,
            });
          });
        },
      );
    });
    promises.push(promise);
  });

  return Promise.all(promises);
};

export const localTimeFormat = (time) => {
  return moment(time.seconds * 1000).format("MMMM Do YYYY, hh:mm a");
};

export const formatDateTime = (dateTimeStamp) => {
  const dateTime = moment.utc(dateTimeStamp.seconds * 1000).local();
  const timeString = dateTime.format("hh:mm a");
  const fulldays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dt = new Date(dateTime),
    date = dt.getDate(),
    month = months[dt.getMonth()],
    diffDays = new Date().getDate() - date,
    diffMonths = new Date().getMonth() - dt.getMonth(),
    diffYears = new Date().getFullYear() - dt.getFullYear();

  let dateTimeString = "";

  if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
    dateTimeString += "Today";
  } else if (diffYears === 0 && diffDays === 1) {
    dateTimeString += "Yesterday";
  } else if (diffYears === 0 && diffDays === -1) {
    dateTimeString += "Tomorrow";
  } else if (diffYears === 0 && diffDays > 1 && diffDays < 7) {
    console.log(dt);
    dateTimeString += fulldays[dt.getDay()];
  } else if (diffYears >= 1) {
    dateTimeString += date + " " + month + ", " + new Date(dateTimeStamp).getFullYear();
  } else {
    dateTimeString += date + " " + month;
  }
  return `${dateTimeString} ${timeString}`;
};

export const mimicClassAsUser = (classroom) => {
  return {
    uname: classroom.className,
    uid: classroom.classId,
    creatorName: classroom.creatorName,
    classCode: classroom.classCode,
    enrolledStudents: classroom.enrolledStudents,
    createdAt: classroom.createdAt,
  };
};
