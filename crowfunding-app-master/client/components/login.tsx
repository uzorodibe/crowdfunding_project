"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import { ILoginUser } from "@/types/types";
import { useContext } from "react";
import { StateContext } from "./context";
import Spinner from "./spinner";

const Login = ({ next }: any) => {
  const { loginUSer }: any = useContext(StateContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // handle submits
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    const params: ILoginUser = {
      email,
      password,
    };
    const response = loginUSer(params);
    response
      .then((res: any) => {
        if (res === true) {
          setErrorMessage("");
        } else {
          setErrorMessage("Invalid Credentials");
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
    // console.log(response);
  };
  return (
    <>
      <div className="min-h-screen bg-[rgba(235,235,235,.85)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-6">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <span className="text-red-500">{errorMessage}</span>
          <div className="bg-[#ece7d5] py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-5  text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    name="email"
                    placeholder="user@example.com"
                    type="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  <div className="hidden absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-[#297ce7] hover:border-[#297ce7] hover:border hover:bg-white hover:text-[#297ce7] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                  >
                    Sign in
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      {loading ? <Spinner /> : ""}
    </>
  );
};

export default Login;
