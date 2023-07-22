"use client";

import Image from "next/image";
import hero from "../public/bloom.jpg";
import Auth from "./auth";
import { useEffect, useState } from "react";
import CampaignForm from "./campaignForm";
import localFont from "next/font/local";
import { StateContext } from "./context";
import { useContext } from "react";
import { useAccount } from "wagmi";
import { PT_Sans, Quicksand } from "next/font/google";
import { useUser } from "@auth0/nextjs-auth0/client";

// FONT DECLARATION
const myFont = localFont({
  src: "../public/fonts/Chromatic/GRADPLA.woff2",
});
// const paraFont = localFont({
//   src: "../public/fonts/Chromatic/Grad.ttf",
// });

const paraFont = Quicksand({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const [user, setUser] = useState<string | null>();
  const [modal, setModal] = useState(false);
  const [category, setCategory] = useState();
  const [verified, setVerified] = useState();
  const [loginModal, setLoginModal] = useState(false);
  const { address } = useAccount();

  const { getUserByAddress }: any = useContext(StateContext);

  if (address) {
    const checkUSer = getUserByAddress(address);
    checkUSer
      .then((res: any) => {
        setCategory(res.category);
        setVerified(res.verified);
        if (address && verified) {
          setLoginModal(false);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  // get user social account
  const { user: account } = useUser();
  if (typeof window !== "undefined") {
    const userEmail = localStorage.getItem("email");

    useEffect(() => {
      // check for changes
      window.addEventListener("storage", (event) => {
        console.log("Storage changed");

        const userEmail = localStorage.getItem("email");
        setUser(userEmail);
      });
    }, [user]);

    // check if user account is linked
    const checkLogin = () => {
      if (account) {
        setModal(true);
      } else {
        if (confirm("Please connect a social account to continue") == true) {
          location.replace("/api/auth/login");
        }
      }
    };
    return (
      <>
        {" "}
        {!loginModal ? (
          modal ? (
            <CampaignForm setModal={setModal} />
          ) : (
            <div className="bg-[#ece7d5]">
              <div className="-z-50 opacity-50 w-screen h-max min-w-[100vw]  absolute top-0">
                {/* <Image
                  src={hero}
                  alt="logo"
                  className="-z-50 opacity-50 w-screen h-screen min-w-[100vw] min-h-[100vh] absolute top-0"
                /> */}
              </div>
              <main className="flex py-32 w-screen h-max min-w-[100vw] flex-col items-center justify-center ">
                <div
                  className=" w-2/3 h-64 py-24 rounded-2xl"
                  style={{
                    backgroundImage: `url(${hero.src})`,
                    backgroundPosition: "center",
                    backgroundSize: "inherit",
                  }}
                ></div>
                <div className="">
                  <div
                    className={`${myFont.className} capitalize text-[9vh] font-bold text-center col-start-1 col-end-7 mxs:text-[4vh] msm:col-end-13`}
                  >
                    Fund, build and protect what matters.
                  </div>
                  <h1
                    className={`${paraFont.className} font-semibold capitalize text-base text-center py-4`}
                  >
                    From products to protocols, our tools empower community-led
                    funding and trustworthy digital experiences.
                  </h1>
                </div>
                {address && verified ? (
                  category === 0 ? (
                    <button
                      onClick={checkLogin}
                      className=" bg-[#15322b] text-white text-center rounded-md px-5 py-2 text-lg"
                    >
                      Create Campaign
                    </button>
                  ) : category === 1 ? (
                    <button className=" bg-[#15322b] text-white text-center rounded-md px-5 py-2 text-lg">
                      Welcome Investor!
                    </button>
                  ) : category === 2 ? (
                    <button className=" bg-[#15322b] text-white text-center rounded-md px-5 py-2 text-lg">
                      Welcome Vendor!
                    </button>
                  ) : (
                    ""
                  )
                ) : (
                  <button
                    onClick={() => {
                      address
                        ? setLoginModal(true)
                        : alert("Connect your Metamask Wallet");
                    }}
                    className=" bg-[#15322b] text-white text-center rounded-md px-5 py-2 text-lg"
                  >
                    Get Started
                  </button>
                )}
              </main>
            </div>
          )
        ) : (
          <Auth />
        )}
      </>
    );
  } else {
    return;
  }
}
