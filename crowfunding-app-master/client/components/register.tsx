"use client";

import React from "react";
import { useState } from "react";
import { IRegisterUser } from "@/types/types";
import { useContext } from "react";
import { StateContext } from "./context";
import Spinner from "./spinner";

const Register = () => {
  // retrieve registuser function from context
  const { registerUSer }: any = useContext(StateContext);

  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState<string>("0");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // handle submits
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    if (confirmPassword !== password) {
      setErrorMessage(`Passwords do not match`);
      return;
    }
    if (!category) {
      setErrorMessage("select a category");
      return;
    }
    const params: IRegisterUser = {
      email,
      password,
      category,
    };
    const listen = registerUSer(params);
    listen
      .then((res: any) => {
        location.replace("/ ");
      })
      .catch((err: any) => {
        console.log(err);
        setErrorMessage("An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <section className="antialiased flex flex-col justify-end  bg-[rgba(235,235,235,.85)]  text-gray-600 min-h-screen py-12 sm:px-6 lg:px-8 px-6">
        <div className="mt-28 h-full">
          <div>
            <div className="relative px-4 sm:px-6 lg:px-8 pb-8 max-w-lg mx-auto">
              <div className="bg-[#ece7d5] px-8 pb-6 rounded-b shadow-lg">
                <div className="text-center mb-6">
                  <div className="mb-2"></div>
                  <span className="text-red-500">{errorMessage}</span>
                  <h1 className="text-xl leading-snug text-gray-800 font-semibold mb-2">
                    Web3 CrowdFunding App 🔥
                  </h1>
                  <div className="text-sm">
                    Support and create campaigns when you flow with us.
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="category"
                      >
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full min-w-full"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        required
                      >
                        <option value="0" selected>
                          Entrepreneur
                        </option>
                        <option value="1">Investor</option>
                        <option value="2">Vendor</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="password"
                        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="confirmPassword"
                        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                        type="password"
                        placeholder="confirm password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-4">
                      <button
                        type="submit"
                        className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out w-full bg-[#297ce7] hover:border-[#297ce7] hover:border hover:bg-white hover:text-[#297ce7] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo text-white focus:outline-none focus-visible:ring-2"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {loading ? <Spinner /> : ""}
    </>
  );
};

export default Register;
