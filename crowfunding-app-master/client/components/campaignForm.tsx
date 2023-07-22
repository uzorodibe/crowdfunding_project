"use client";

import React from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import { ICreateCampaign } from "@/types/types";
import { useContext } from "react";
import { StateContext } from "./context";
import { FaTimes } from "react-icons/fa";
import Spinner from "./spinner";

const CampaignForm = ({ setModal }: any) => {
  const { createCampaigns }: any = useContext(StateContext);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);

    const params: ICreateCampaign = {
      title,
      date: toTimestamp(date),
      amount,
      image,
      minAmount,
      description,
    };

    const listen = createCampaigns(params);
    listen
      .then((res: any) => {
        setModal(false);
        // console.log(res);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
    // setModal(false);
  };
  // change date format
  const toTimestamp = (dateStr: typeof date) => {
    const dateObj = Date.parse(dateStr);
    return dateObj / 1000;
  };
  return (
    <>
      <section className="antialiased bg-gray-100 text-gray-600 min-h-screen py-24 p-4">
        <div className="h-full">
          <div>
            <div className="relative px-4 sm:px-6 lg:px-8 pb-8 max-w-lg mx-auto">
              <div className="relative bg-white px-8 pb-6 rounded-b shadow-lg">
                <FaTimes
                  onClick={() => setModal(false)}
                  className="cursor-pointer absolute top-2 right-3 text-2xl"
                />{" "}
                <div className="text-center mb-6">
                  <h1 className="text-xl leading-snug text-gray-800 font-semibold mb-2">
                    Create a Campaign 🔥
                  </h1>
                </div>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="title"
                    >
                      Campaign Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                      type="text"
                      placeholder="Campaign Title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      required
                    />
                  </div>

                  <div className="flex space-x-4 mxs:flex-col">
                    <div className="flex-1">
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="date"
                      >
                        Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="date"
                        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                        type="date"
                        placeholder="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="amount"
                      >
                        Amount Needed <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="amount"
                        className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                        type="number"
                        placeholder="Amount needed"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="title"
                    >
                      Minimum Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                      type="number"
                      placeholder="Minimum amount"
                      value={minAmount}
                      onChange={(event) => setMinAmount(event.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="image"
                    >
                      Image url <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="image"
                      className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                      type="text"
                      placeholder="Add Image Url....."
                      value={image}
                      onChange={(event) => setImage(event.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="description"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      rows={6}
                      className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                      placeholder="description....."
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <div className="mb-4">
                      <button
                        type="submit"
                        className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out w-full bg-[#297ce7] hover:border-[#297ce7] hover:border hover:bg-white hover:text-[#297ce7] focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo text-white focus:outline-none focus-visible:ring-2"
                      >
                        Create Campaign
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

export default withPageAuthRequired<any>(CampaignForm);
