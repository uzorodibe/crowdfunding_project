/* eslint-disable no-process-exit */
import { ethers, upgrades } from "hardhat";

// This code uses the Hardhat framework and the ethers library to upgrade an existing
// smart contract on the Ethereum blockchain.
const PROXY_ADDRESS = "0xa823380481AbD22a070a8689EFc5B8C359929341"; // Address of version 1

async function main() {
  // We get the contract to deploy
  const CampaignRegistryUpgradeableV2 = await ethers.getContractFactory("CampaignRegistry");
  const upgraded = await upgrades.upgradeProxy(
    PROXY_ADDRESS,
    CampaignRegistryUpgradeableV2,
    // call: { fn: "reInitialize" },
    // kind: "uups",
  );
  const implementationV2Address = await upgrades.erc1967.getImplementationAddress(upgraded.address);

  console.log("ImplementationV2 contract address: " + implementationV2Address);
  console.log("Contract Upgraded address", upgraded.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
