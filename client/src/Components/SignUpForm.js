import React from "react";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router";
import db from "../services/firebase-config";
import { doc, setDoc } from "@firebase/firestore";
import { Link } from "react-router-dom";
import { authErrors } from "../services/AuthErrors";

function SignupForm() {
  const [data, setData] = useState({
    uname: "",
    email: "",
    password: "",
    repPassword: "",
    role: "Student",
    error: null,
    loading: "",
  });

  const { uname, email, password, repPassword, role, error, loading } = data;

  const { signup } = useAuth();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });

    if (!uname || !email || !password || !repPassword || !role) {
      setData({ ...data, error: "All fields are required" });
    } else if (password !== repPassword) {
      setData({ ...data, error: "Password doesnot match" });
    } else {
      try {
        const result = await signup(email, password);
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          uname: uname,
          email: email,
          role: role,
          enrolledClasses: [],
        });
        setData({
          uname: "",
          email: "",
          password: "",
          repPassword: "",
          role: "Student",
          error: null,
          loading: false,
        });
        navigate("/");
      } catch (err) {
        let message = "Failed to signup";
        switch (err.code) {
          case "auth/email-already-in-use":
            message = "Email already in use";
            break;
          case "auth/weak-password":
            message = "Weak Password: Password must be 6 characters length";
            break;
          default:
            message = "Failed to signup";
        }
        setData({ ...data, error: message, loading: false });
      }
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto my-10">
      {error ? <p className="text-red-500 text-xs italic">{error}</p> : null}
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Name
            <span className="text-red-500 italic ">*</span>
          </label>
          <input
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <span className="text-red-500 italic ">*</span>
          </label>
          <input
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="email"
            name="email"
            placeholder="Email"
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
            <span className="text-red-500 italic ">*</span>
          </label>
          <input
            name="password"
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Confirm Password
            <span className="text-red-500 italic ">*</span>
          </label>
          <input
            name="repPassword"
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="repPassword"
            placeholder="Re-enter Password"
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role"
          >
            Role
            <span className="text-red-500 italic ">*</span>
          </label>
          <select
            name="role"
            id="role"
            className="focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
          >
            <option value="Student" defaultValue>
              Student
            </option>

            <option value="Teacher">Teacher</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            disabled={
              loading ||
              email.length === 0 ||
              password.length === 0 ||
              uname.length === 0
            }
            onClick={handleSubmit}
            className="bg-blue-500 disabled:opacity-30 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            {loading ? <span>Signing In</span> : <span>Sign Up</span>}
          </button>
        </div>
        <Link to="/">
          <p className="my-4 inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Already an Account?
          </p>
        </Link>
      </form>
    </div>
  );
}

export default SignupForm;
