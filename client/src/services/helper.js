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