import { useAuth } from "./AuthContext";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        await login(email, password);
        setData({
          email: "",
          password: "",
          error: null,
          loading: false,
        });
        navigate("/");
      } catch (err) {
        setData({ ...data, error: "Failed to login", loading: false });
      }
    }
  };
  console.log(currentUser);

  return (
    <div>
      <h3>Login form</h3>
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">{error}</strong>
          </div>
        )}
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

        <button
          type="submit"
          disabled={loading}
          className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
