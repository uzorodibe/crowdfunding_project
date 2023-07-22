"use client";

import abi from "../../../server/artifacts/contracts/CampaignRegistry.sol/CampaignRegistry.json";
// import { getGlobalState, setGlobalState } from '../store'
import { ethers } from "ethers";
import { ICreateCampaign } from "@/types/types";
import { IRegisterUser } from "@/types/types";
import { ILoginUser } from "@/types/types";
import React, { useContext, createContext, useEffect } from "react";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";

export const StateContext = createContext(null);

export const StateContextProvider = ({ children }: any) => {
  const { isDisconnected } = useAccount();
  const { open, close } = useWeb3Modal();

  if (typeof window !== "undefined") {
    const { ethereum }: any = window;

    const contractAddress = "0xa823380481AbD22a070a8689EFc5B8C359929341";
    const contractAbi = abi.abi;
    let tx;

    const getEtheriumContract = async () => {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      return contract;
    };

    // Register User
    const registerUSer = async ({
      email: _email,
      password: _password,
      category: _category,
    }: IRegisterUser) => {
      if (!ethereum) {
        if (
          confirm(
            "Please install Metamask extension or open in metamask Dapp"
          ) == true
        ) {
          window.open("https://metamask.io/");
        }
      }
      if (isDisconnected) {
        if (confirm("Please connect your wallet") == true) {
          // open();
        }
      }
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        tx = await contract.registerUser(_email, _password, _category, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        await tx.wait();
        // router.push("/login");
        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // login users
    const loginUSer = async ({
      email: _email,
      password: _password,
    }: ILoginUser) => {
      if (!ethereum) {
        if (
          confirm(
            "Please install Metamask extension or open in metamask Dapp"
          ) == true
        ) {
          window.open("https://metamask.io/");
        }
      }
      if (isDisconnected) {
        if (confirm("Please connect your wallet") == true) {
          // open();
        }
      }
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        tx = await contract.loginUser(_email, _password, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        // router.push("/");

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // create campaign
    const createCampaigns = async ({
      amount: Amount,
      date: _deadline,
      image: _imageUri,
      title: _campaignTitle,
      minAmount: minimumContribution,
      description: _campaignDescription,
    }: ICreateCampaign) => {
      if (!ethereum) {
        if (
          confirm(
            "Please install Metamask extension or open in metamask Dapp"
          ) == true
        ) {
          window.open("https://metamask.io/");
        }
      }
      if (isDisconnected) {
        if (confirm("Please connect your wallet") == true) {
          // open();
        }
      }
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        let _targetAmount = ethers.utils.parseEther(Amount);
        let minAmount = ethers.utils.parseEther(minimumContribution);

        tx = await contract.createCampaign(
          _targetAmount,
          _deadline,
          minAmount,
          _imageUri,
          _campaignTitle,
          _campaignDescription
          // {
          //   gasLimit: gasLimit,
          //   gasPrice: gasPrice.add(extraGas),
          // }
        );
        await tx.wait();
        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // Donate to campaign
    const donateToCampaign = async ({
      correctAmount,
      campaignId: _campaignId,
    }: any) => {
      if (!ethereum) {
        if (
          confirm(
            "Please install Metamask extension or open in metamask Dapp"
          ) == true
        ) {
          window.open("https://metamask.io/");
        }
      }
      if (isDisconnected) {
        if (confirm("Please connect your wallet") == true) {
          // open();
        }
      }
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        let amount = ethers.utils.parseEther(correctAmount);
        tx = await contract.donateToCampaign(_campaignId, {
          value: amount,
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });

        await tx.wait();

        return tx;
      } catch (error) {
        reportError(error);
      }
    };

    // get All Donators
    const getAllDonators = async (_campaignId: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.donateToCampaign(_campaignId, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        // await tx.wait();
        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // get All Donations
    const getAllDonations = async (_campaignId: any) => {
      if (isDisconnected) {
        return;
      }
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.getAllDonations(_campaignId);

        return tx;
      } catch (error) {
        reportError(error);
      }
    };

    // get Investor Donations
    const getInvestorDonations = async (_campaignId: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.getAllDonators(_campaignId, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // get Campaigns By Entrepreneur
    const getCampaignsByEntrepreneur = async (address: any) => {
      if (isDisconnected) {
        return;
      }
      try {
        // if (!ethereum) return

        const contract = await getEtheriumContract();

        let _entrepreneur = address;
        tx = await contract.getCampaignsByEntrepreneur(_entrepreneur);
        // await tx.wait();

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // get User By Address
    const getUserByAddress = async (_walltetAddress: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        tx = await contract.getUserByAddress(_walltetAddress);
        // await tx.wait();
        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // get Total Campaigns By Investor
    const getTotalCampaignsByInvestor = async ({
      address: _entrepreneur,
    }: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.getTotalCampaignsByInvestor(_entrepreneur);
        await tx.wait();

        return tx;
      } catch (error) {
        reportError(error);
      }
    };

    // create campaign
    const getCampaigns = async () => {
      // if (isDisconnected) {
      //   console.log(isDisconnected);

      //   return;
      // }
      try {
        const contract = await getEtheriumContract();

        tx = await contract.getCampaigns();
        // await tx.wait();

        return tx;
      } catch (error) {
        console.log(error);
        reportError(error);
      }
    };

    // get campaign count
    const getCampaignCount = async () => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        tx = await contract.getCampaignCount();
        // await tx.wait();

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // create Fund Release Request
    const createFundReleaseRequest = async ({
      id: _campaignId,
      amount: _requestAmount,
      address: _vendorAddress,
    }: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        let _targetAmount = ethers.utils.parseEther(_requestAmount);
        tx = await contract.createFundReleaseRequest(
          _campaignId,
          _targetAmount,
          _vendorAddress,
          {
            gasLimit: gasLimit,
            gasPrice: gasPrice.add(extraGas),
          }
        );
        // await tx.wait();

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // create Fund Release Request
    const approveFundReleaseRequest = async (_campaignId: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.approveFundReleaseRequest(_campaignId, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        // await tx.wait();

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // confirm Funds Received
    const confirmFundsReceived = async (_campaignId: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.confirmFundsReceived(_campaignId, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        // await tx.wait();

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // decline Fund Release
    const declineFundRelease = async (_campaignId: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.declineFundRelease(_campaignId, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        await tx.wait();

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // withdraw Funds
    const withdrawFunds = async (_campaignId: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.withdrawFunds(_campaignId, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        await tx.wait();
        console.log(tx);

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // is Request Approved Or Declined
    const isRequestApprovedOrDeclined = async (_campaignId: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.isRequestApprovedOrDeclined(_campaignId, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        // await tx.wait();
        // console.log(tx);

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // make Campaign Expired
    const makeCampaignExpired = async (_campaignId: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.makeCampaignExpired(_campaignId);
        // await tx.wait();
        // console.log(tx);

        return tx;
      } catch (error) {
        reportError(error);
      }
    };
    // release Funds To Vendors
    const releaseFundsToVendors = async (_campaignId: any) => {
      try {
        if (!ethereum) return;

        const contract = await getEtheriumContract();

        const provider = new ethers.providers.Web3Provider(ethereum);
        const gasLimit = 1500000;
        const gasPrice = await provider.getGasPrice();
        const extraGas = ethers.utils.parseUnits("100", "gwei");

        // let _targetAmount = ethers.utils.parseEther(Amount);
        tx = await contract.releaseFundsToVendors(_campaignId, {
          gasLimit: gasLimit,
          gasPrice: gasPrice.add(extraGas),
        });
        await tx.wait();

        return tx;
      } catch (error) {
        reportError(error);
      }
    };

    return (
      <StateContext.Provider
        value={
          {
            createCampaigns,
            registerUSer,
            loginUSer,
            getCampaigns,
            donateToCampaign,
            getCampaignCount,
            getInvestorDonations,
            getAllDonators,
            getAllDonations,
            getCampaignsByEntrepreneur,
            getTotalCampaignsByInvestor,
            createFundReleaseRequest,
            approveFundReleaseRequest,
            releaseFundsToVendors,
            getUserByAddress,
            confirmFundsReceived,
            declineFundRelease,
            withdrawFunds,
            isRequestApprovedOrDeclined,
            makeCampaignExpired,
          } as any
        }
      >
        {children}
      </StateContext.Provider>
    );
  } else {
    return;
  }
};
// export const useStateContext = () => useContext(StateContext);
// export { createCampaigns, registerUSer, loginUSer, getCampaigns };
