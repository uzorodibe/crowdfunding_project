"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import UserCampaigns from "./userCampaigns";
import { useContext } from "react";
import { StateContext } from "./context";

const Profile = () => {
  const { address } = useAccount();
  const [campaigns, setCampaigns] = useState<any>([]);
  const [donations, setDonations] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);
  const [finishedCampaigns, setFinishedCampaigns] = useState(0);
  const { getCampaignsByEntrepreneur }: any = useContext(StateContext);
  const allCampaigns = getCampaignsByEntrepreneur(address);
  allCampaigns
    .then((res: any) => {
      setCampaigns(res);
    })
    .catch((err: any) => {
      console.log(err);
    });

  // convert hex string
  const convertHexString = (value: string) => {
    const hexToInt = (hex: string) => parseInt(hex, 16);
    const weiToEth = (wei: number) => wei / Math.pow(10, 18);
    const inWei = hexToInt(value);
    const inEth = weiToEth(inWei);
    return inEth;
  };
  let eth = 0;
  let finished = 0;
  let active = 0;
  useEffect(() => {
    if (campaigns) {
      campaigns.map((camp: any) => {
        const amount = convertHexString(camp.raisedAmount["_hex"]);
        eth = eth + amount;
        setDonations(eth);
        const date =
          (new Date(parseInt(camp.deadline["_hex"]) * 1000).getTime() -
            new Date().getTime()) /
          (1000 * 60 * 60 * 24);
        if (date > 0) {
          active = active + 1;
          setActiveCampaigns(active);
        } else {
          finished = finished + 1;
          setFinishedCampaigns(finished);
        }
      });
    }
  }, [campaigns]);

  return (
    <>
      <div className="w-screen flex flex-col items-center justify-around">
        <div className="mt-20 w-11/12 text-xs border border-black h-28 text-center flex flex-row flex-wrap justify-evenly items-center mb-10 mxs:flex-col">
          <div className="flex flex-col items-center justify-center w-1/4 h-full  border-r border-black">
            <h1>Successful Campaigns</h1>
            <h1 className=" font-bold">
              {" "}
              {campaigns ? campaigns.length : "0"}
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center w-1/4 h-full  border-r border-black">
            <h1>Completed Campaigns</h1>
            <h1 className=" font-bold">{finishedCampaigns}</h1>
          </div>
          <div className="flex flex-col items-center justify-center w-1/4 h-full  border-r border-black">
            <h1>Donations</h1>
            <h1 className=" font-bold">{donations} ETH</h1>
          </div>
          <div className="flex flex-col items-center justify-center w-1/4 h-full ">
            <h1>Active Campaigns</h1>
            <h1 className=" font-bold">{activeCampaigns}</h1>
          </div>
        </div>
        <h1 className="text-center font-bold text-2xl">All Campaigns</h1>
        <UserCampaigns />
      </div>
    </>
  );
};

export default Profile;
