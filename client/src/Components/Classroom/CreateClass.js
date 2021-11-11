import React from "react";
import { useState } from "react";

function CreateClass({ closeForm, createClass }) {
  const [className, setclassName] = useState("");
  const [uname, setuname] = useState("");
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h4 className="text-3xl font-semibold">Create Class</h4>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-3 float-right text-3xl leading-none font-bold outline-none focus:outline-none"
                onClick={closeForm}
              >
                ×
              </button>
            </div>
            {/*body*/}

            <div className="relative p-6 flex-auto">
              <p className="my-4 text-blueGray-500 text-md leading-relaxed">
                Please enter details to create className
              </p>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Class Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="classCode"
                type="text"
                placeholder="Class Name"
                onChange={(event) => {
                  setclassName(event.target.value);
                }}
              />
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="classCode"
                type="text"
                placeholder="Name"
                onChange={(event) => setuname(event.target.value)}
              />
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={closeForm}
              >
                Close
              </button>
              <button
                className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => createClass(className, uname)}
              >
                Create className
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default CreateClass;
