"use client";

import { useState, useEffect } from "react";
import { Slider, SliderItem } from "@/components/slider/slider";
import { useContext } from "react";
import { StateContext } from "@/components/context";
import StyleWrapper from "@/components/slider/style";
import Campaigns from "@/components/campaigns";
import Home from "@/components/home";
import { Web3Button } from "@web3modal/react";
import Profile from "@/components/profile";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineCleanHands } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";

const HomeV5 = () => {
  const [linked, setLinked] = useState("Link Account");
  const [category, setCategory] = useState();
  const [verified, setVerified] = useState();
  const { open, close } = useWeb3Modal();
  const { getUserByAddress }: any = useContext(StateContext);
  const { address } = useAccount();
  if (address) {
    const checkUSer = getUserByAddress(address);
    checkUSer
      .then((res: any) => {
        setCategory(res.category);
        setVerified(res.verified);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  const { user } = useUser();
  useEffect(() => {
    if (user) {
      setLinked("Account linked");
    }
  }, [user]);

  const menuData = [
    <div className="flex flex-row items-baseline">
      <AiOutlineHome className="mx-1" /> Home
    </div>,
    <div className="flex flex-row items-baseline">
      <MdOutlineCleanHands className="mx-1" /> Campaigns
    </div>,
    <div className="flex flex-row items-baseline">
      <FaUserCircle className="mx-1" /> Profile
    </div>,
    <div className="flex flex-row items-baseline">
      <FaUserCircle className="mx-1" /> Profile
    </div>,
  ];

  const settings = {
    swipe: false,
    dots: true,
    arrows: false,
    autoplay: false,
    speed: 500,
    autoplaySpeed: 500,
    centerMode: true,
    centerPadding: "0px",
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: (i: number) => <span>{menuData[i]}</span>,
  };

  return (
    <>
      <StyleWrapper>
        <Slider {...settings}>
          <SliderItem>
            <Home />
          </SliderItem>
          <SliderItem>
            <Campaigns />
          </SliderItem>
          <SliderItem>
            <Profile />
          </SliderItem>
        </Slider>
      </StyleWrapper>
      {verified ? (
        <div className="fixed right-0 top-[49px] px-3 py-5">
          <a
            href="/api/auth/login "
            className="bg-blue-500 text-xs px-3 py-1.5 text-white rounded-xl"
          >
            {linked}
          </a>
        </div>
      ) : (
        ""
      )}
      {address ? (
        <a
          href="/api/auth/logout"
          onClick={() => {
            localStorage.clear();
            window.dispatchEvent(new Event("storage"));
          }}
          className="flex items-center justify-end fixed top-0 right-0 uppercase text-[0.7rem] bg-[#15322b] text-white mx-auto pr-5 text-xs h-[60px] mmd:w-[25vw]"
        >
          Log Out
        </a>
      ) : (
        <button
          onClick={() => {
            if (confirm("Please connect your wallet") == true) {
              open();
            }
          }}
          className="flex items-center justify-end fixed top-0 right-0 uppercase text-[0.7rem] bg-[#15322b] text-white mx-auto pr-5 text-xs h-[60px] mmd:w-[25vw]"
        ></button>
      )}
      <div className="fixed right-0 bottom-0 px-3 py-5">
        <Web3Button />
      </div>
    </>
  );
};

export default HomeV5;
