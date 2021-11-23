import {
  addDoc,
  collection,
  doc,
  setDoc,
  Timestamp,
} from "@firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import db from "../../services/firebase-config";

function PollCard({ classDetails, closeForm }) {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  const addNewField = (e) => {
    e.preventDefault();
    setOptions((prevlist) => [...prevlist, ""]);
  };

  const setValueAtIndex = (value, index) => {
    let prevState = [...options];
    prevState[index] = value;
    setOptions(prevState);
  };

  const clearOption = (index) => {
    let prevState = [...options];
    prevState.splice(index, 1);
    setOptions(prevState);
  };

  const createPoll = async () => {
    setLoading(true);
    const msgId = classDetails.uid;
    const msg = {
      title: title,
      poll: options.map((value) => {
        return { option: value, count: 0 };
      }),
      submissionList: [],
      pollId: "",
    };

    const docRef = await addDoc(collection(db, "messages", msgId, "chats"), {
      pollObj: msg,
      text: "Please Respond: " + title,
      from: msgId,
      to: msgId,
      createdAt: Timestamp.fromDate(new Date()),
      attachments: [],
      unread: true,
      taggedMsg: null,
      senderName: classDetails.uname,
    });

    await setDoc(
      docRef,
      { pollObj: { ...msg, pollId: docRef.id } },
      { merge: true },
    );

    await setDoc(doc(db, "lastMsgs", msgId), {
      text: "Please Respond",
      from: msgId,
      to: msgId,
      users: [msgId],
      createdAt: Timestamp.fromDate(new Date()),
      unread: true,
    });
    closeForm();
    setLoading(false);
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative lg:w-1/2 w-9/12 my-6 mx-auto">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="text-center w-full p-4 bg-gray-600  rounded-t-lg">
              <h2 className="center mx-auto text-xl font-bold h-7 overflow-visible text-white">
                Poll Card
              </h2>
            </div>
            <div className="w-full mx-auto my-2">
              <form className="bg-white rounded px-8 pt-6 pb-8">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm mb-3"
                    htmlFor="code"
                  >
                    Title
                    <span className="text-red-500 italic ">*</span>
                  </label>
                  <textarea
                    className="focus:outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="2"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                    placeholder="Title"
                  ></textarea>
                </div>
                {options.map((option, index) => {
                  return (
                    <div className="mb-2 flex flex-row">
                      <label
                        className="block text-gray-700 text-sm mb-3"
                        htmlFor="option"
                      ></label>
                      <input
                        className="focus:outline-none lg:w-1/4 w-1/2 placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="code"
                        type="text"
                        value={option}
                        onChange={(e) => setValueAtIndex(e.target.value, index)}
                        name="option"
                        placeholder="Option"
                      />
                      {index <= 1 ? (
                        <span className="text-red-500 italic ">*</span>
                      ) : null}
                      <button
                        onClick={() => clearOption(index)}
                        type="button"
                        disabled={index <= 1}
                        class="inline-flex display disabled:invisible items-center justify-center focus:ring-indigo-500"
                      >
                        <span class="sr-only">Close menu</span>
                        <svg
                          class="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
                <button
                  className="flex flex-row py-2"
                  onClick={(e) => addNewField(e)}
                >
                  <span className="bg-green-700 rounded-full ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-600">Add Option</span>
                </button>
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={createPoll}
                    disabled={
                      loading ||
                      title.length === 0 ||
                      options[0].length === 0 ||
                      options[1].length === 0
                    }
                    className="bg-transparent hover:bg-blue-500 disabled:opacity-30 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                    type="button"
                  >
                    {loading ? <span>Creating...</span> : <span>Create</span>}
                  </button>
                  <button
                    onClick={closeForm}
                    className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    type="button"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default PollCard;
