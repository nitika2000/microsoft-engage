import React from "react";
import { useState } from "react";
import db from "../../services/firebase-config";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { getSlug } from "../../services/helper";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router";

const classCodeLen = 6;

function CreateClassForm({ closeForm }) {
  const [className, setclassName] = useState("");
  const { currentUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  const createClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const classObj = {
        className: className,
        creatorName: currentUserData.uname,
        creatorUid: currentUserData.uid,
        classCode: getSlug(classCodeLen),
        classId: "",
        enrolledStudents: [],
      };

      const classRef = await addDoc(collection(db, "classrooms"), classObj);
      await setDoc(doc(collection(db, "classrooms"), classRef.id), {
        ...classObj,
        classId: classRef.id,
      });

      currentUserData.enrolledClasses.push({
        className: classObj.className,
        classId: classRef.id,
        creatorName: classObj.creatorName,
      });

      await setDoc(doc(collection(db, "users"), currentUserData.uid), {
        ...currentUserData,
        enrolledClasses: currentUserData.enrolledClasses,
      });
      setLoading(false);
      closeForm();
      navigate(`${classRef.id}`);
    } catch {
      setError("Error-404");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="text-center p-4 bg-gray-600  rounded-t-lg">
              <h2 className="center mx-auto text-xl font-bold h-7 overflow-visible text-white">
                Create Class
              </h2>
            </div>
            <div className="w-full max-w-xs mx-auto my-2">
              <form className="bg-white rounded px-8 pt-6 pb-8" onSubmit={(e) => createClass()}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm mb-3"
                    htmlFor="code"
                  >
                    Please enter the name of the class
                    <span className="text-red-500 italic ">*</span>
                  </label>
                  <input
                    className="focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="classname"
                    type="text"
                    value={className}
                    onChange={(e) => setclassName(e.target.value)}
                    name="classname"
                    placeholder="Class Name"
                  />
                  {error ? (
                    <p className="text-red-500 text-xs italic">{error}</p>
                  ) : null}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    disabled={loading || className.length === 0}
                    onClick={(e) => createClass}
                    className="bg-transparent hover:bg-blue-500 disabled:opacity-30 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                    type="button"
                  >
                    {loading ? <span>Creating..</span> : <span>Create</span>}
                  </button>
                  <button
                    onClick={closeForm}
                    className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    type="button"
                  >
                    Close
                  </button>
                </div>
                <p className="pt-5 text-gray-400 text-xs italic"></p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default CreateClassForm;
