import React from "react";
import { useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router";

function SignupForm() {
  const emailRef = useRef(null);
  const pwdRef = useRef(null);
  const rptPwdRef = useRef(null);
  const roleRef = useRef(null);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const { signup } = useAuth();
  const { currentUser } = useAuth();
  console.log(currentUser);
  const navigate = useNavigate();
  console.log(navigate);

  async function handleSubmit(e) {
    e.preventDefault();

    if (pwdRef.current.value !== rptPwdRef.current.value) {
      return seterror("Password doesnot match");
    }

    try {
      seterror("");
      setloading(true);
      await signup(emailRef.current.value, pwdRef.current.value);
      navigate("/login");
    } catch {
      seterror("Failed to create an account");
    }
    setloading(false);
  }

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
        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          required
          ref={emailRef}
          className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
        <label htmlFor="psw">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="psw"
          required
          ref={pwdRef}
          className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
        ></input>
        <label htmlFor="psw-repeat">
          <b>Repeat Password</b>
        </label>
        <input
          type="password"
          placeholder="Repeat Password"
          name="psw-repeat"
          required
          ref={rptPwdRef}
          className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
        ></input>
        <label htmlFor="role">Role</label>
        <select name="role" id="role" ref={roleRef}>
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
