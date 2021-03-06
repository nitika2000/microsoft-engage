import { useAuth } from "./AuthContext";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "@firebase/firestore";
import db from "../services/firebase-config";

function LoginForm() {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: "",
  });

  const { email, password, error, loading } = data;

  const { login } = useAuth();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "All fields are required" });
    } else {
      try {
        const result = await login(email, password);
        await setDoc(
          doc(db, "users", result.user.uid),
          {
            isOnline: true,
          },
          { merge: true },
        );
        setData({
          email: "",
          password: "",
          error: null,
          loading: false,
        });
        navigate("/");
      } catch (err) {
        let message = "Failed to login";
        switch (err.code) {
          case "auth/user-not-found":
            message = "User not found with this email";
            break;
          default:
            message = "Failed to login";
        }
        setData({ ...data, error: message, loading: false });
      }
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto my-10">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username<span className="text-red-500 italic ">*</span>
          </label>
          <input
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            name="email"
            placeholder="Username"
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password<span className="text-red-500 italic ">*</span>
          </label>
          <input
            name="password"
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
          />
        </div>
        {error ? (
          <p className="text-red-500 text-xs italic text-center">{error}</p>
        ) : null}

        <div className="flex items-center justify-between">
          <button
            disabled={loading || email.length === 0 || password.length === 0}
            onClick={handleSubmit}
            className="bg-blue-500 disabled:opacity-30 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            {loading ? <span>Loging In</span> : <span>Log In</span>}
          </button>
        </div>
        <Link to="/signup">
          <p className="my-4 inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Need an Account?
          </p>
        </Link>
      </form>
    </div>
  );
}

export default LoginForm;
