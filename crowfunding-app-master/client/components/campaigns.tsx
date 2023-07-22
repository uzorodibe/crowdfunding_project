"use client";

import React from "react";
import Campaign from "./campaign";
import { useContext } from "react";
import { StateContext } from "./context";
import { useState } from "react";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<any>([]);
  const { getCampaigns }: any = useContext(StateContext);
  const allCampaigns = getCampaigns();
  allCampaigns
    .then((res: any) => {
      setCampaigns(res);
    })
    .catch((err: any) => {
      console.log(err);
    });
  // console.log(campaigns);

  return (
    <div className="flex flex-row items-center justify-startn flex-wrap gap-7 mt-28 mb-10 px-10 mxs:px-6">
      {campaigns ? (
        campaigns.map((camp: any, i: any) => (
          <a
            href={`/campaign/${i}`}
            className="h-80 my-2 xs:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5  mxs:w-full"
          >
            <Campaign
              key={i}
              title={camp.campaignTitle}
              img={camp.imageUri}
              donated={camp.raisedAmount["_hex"]}
              amount={camp.targetAmount["_hex"]}
              deadline={camp.deadline["_hex"]}
            />
          </a>
        ))
      ) : (
        <div className="text-4xl font-bold">No Campaigns yet</div>
      )}
    </div>
  );
};

export default Campaigns;
