import React from "react";
import { useAuth } from "./AuthContext";

function Profile() {
  const { currentUserData } = useAuth();

  return (
    <div className="w-full max-w-xs mx-auto my-10">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="m-auto text-center text-white bg-blue-700 rounded-md p-2 my-2 font-bold text-xl">
          My Profile
        </div>
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Name
          </label>
          <input
            value={currentUserData.uname}
            disabled={true}
            className="focus:outline-none bg-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="uname"
            placeholder="Name"
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            value={currentUserData.email}
            disabled={true}
            className="focus:outline-none bg-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="email"
            name="email"
            placeholder="Email"
          />
        </div>

        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Role
          </label>
          <input
            value={currentUserData.role}
            disabled={true}
            className="focus:outline-none bg-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="email"
            name="email"
            placeholder="Email"
          />
        </div>
      </form>
    </div>
  );
}

export default Profile;
