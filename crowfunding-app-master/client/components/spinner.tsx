import React from "react";
import Image from "next/image";
import loader from "../public/loader.gif";

const Spinner = () => {
  return (
    <>
      <div className="h-full  fixed opacity-80 bg-black w-screen top-0 flex flex-col justify-center items-center">
        <h1 className="text-white ">Transaction is in progress</h1>
        <p className="text-white ">please wait...</p>
        <Image src={loader} alt="loader" className=" h-16 w-16" />
      </div>
    </>
  );
};

export default Spinner;
