import { ethers, upgrades } from "hardhat";

async function main() {
  const CampaignRegistry = await ethers.getContractFactory("CampaignRegistry");
  const campaignRegistryInstanceProxy = await upgrades.deployProxy(CampaignRegistry, {
    initializer: "initialize",
    kind: "uups",
  });

  await campaignRegistryInstanceProxy.deployed();

  const implementationV1Address = await upgrades.erc1967.getImplementationAddress(
    campaignRegistryInstanceProxy.address,
  );

  console.log("proxy deployed to:", campaignRegistryInstanceProxy.address);

  console.log("ImplementationV1 contract address: " + implementationV1Address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
