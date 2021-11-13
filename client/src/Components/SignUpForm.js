import React from "react";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router";
import db from "../services/firebase-config";
import { doc, setDoc } from "@firebase/firestore";

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
        navigate("/login");
      } catch (err) {
        setData({ ...data, error: "Failed", loading: false });
      }
    }
  };
  console.log(currentUser);

  return (
    <div>
      <h3>Signup form</h3>
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">{error}</strong>
          </div>
        )}
        <label htmlFor="uname">
          <b>Name</b>
        </label>
        <input
          type="text"
          placeholder="Enter name"
          name="uname"
          required
          onChange={handleChange}
          className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          required
          onChange={handleChange}
          className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
        <label htmlFor="password">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          required
          onChange={handleChange}
          className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
        ></input>
        <label htmlFor="repPassword">
          <b>Repeat Password</b>
        </label>
        <input
          type="password"
          placeholder="Repeat Password"
          name="repPassword"
          required
          onChange={handleChange}
          className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
        ></input>
        <label htmlFor="role">Role</label>
        <select name="role" id="role" onChange={handleChange}>
          <option value="Student" defaultValue>
            Student
          </option>
          <option value="Teacher">Teacher</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
