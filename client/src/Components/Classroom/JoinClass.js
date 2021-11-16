import React from "react";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import { getClassFromCode } from "../../services/helper";
import { collection, doc, setDoc } from "@firebase/firestore";
import db from "../../services/firebase-config";
import { useNavigate } from "react-router";

function JoinClass({ closeForm }) {
  const { currentUserData } = useAuth();
  const [classCode, setClassCode] = useState("");
  const [error, seterror] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const joinClass = async () => {
    setLoading(true);
    const classObj = await getClassFromCode(classCode);
    if (!classObj) {
      seterror("Invalid class code");
      setLoading(false);
      return;
    }

    const isAlreadyJoined = currentUserData.enrolledClasses.find(
      (enrolledClass) => enrolledClass.classId === classObj.classId,
    );

    if (!isAlreadyJoined) {
      currentUserData.enrolledClasses.push({
        className: classObj.className,
        classId: classObj.classId,
        creatorName: classObj.creatorName,
      });
      await setDoc(doc(collection(db, "users"), currentUserData.uid), {
        ...currentUserData,
        enrolledClasses: currentUserData.enrolledClasses,
      });

      let updatedEnrolledList = classObj.enrolledStudents;
      updatedEnrolledList.push(currentUserData.uid);
      await setDoc(
        doc(collection(db, "classrooms"), classObj.classId),
        {
          enrolledStudents: updatedEnrolledList,
        },
        { merge: true },
      );
      navigate(`${classObj.classId}`);
      closeForm();
    } else {
      seterror("Class is already joined");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="text-center p-4 bg-gray-600  rounded-t-lg">
              <h2 className="center mx-auto text-xl font-bold h-7 overflow-visible text-white">
                Join Class
              </h2>
            </div>
            <div className="w-full max-w-xs mx-auto my-2">
              <form className="bg-white rounded px-8 pt-6 pb-8">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm mb-3"
                    htmlFor="code"
                  >
                    Ask your teacher for the class code, then enter it here.
                    <span className="text-red-500 italic ">*</span>
                  </label>
                  <input
                    className="focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="code"
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    name="code"
                    placeholder="Class Code"
                  />
                  {error ? (
                    <p className="text-red-500 text-xs italic">{error}</p>
                  ) : null}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    disabled={loading || classCode.length === 0}
                    onClick={joinClass}
                    className="bg-transparent hover:bg-blue-500 disabled:opacity-30 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                    type="button"
                  >
                    {loading ? <span>Joining..</span> : <span>Join</span>}
                  </button>
                  <button
                    onClick={closeForm}
                    className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    type="button"
                  >
                    Close
                  </button>
                </div>
                <p className="pt-5 text-gray-400 text-xs italic">
                  Use a class code with 6 letters or numbers, and no spaces or
                  symbols
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default JoinClass;
