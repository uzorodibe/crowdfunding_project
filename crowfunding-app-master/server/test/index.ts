/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
// Import the necessary libraries and contracts
import { ethers, waffle, upgrades } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { expect } from "chai";

describe("CrowdfundingRegistry", function () {
  let campaignRegistry: Contract;
  let entrepreneur: Signer | any;
  let investor1: Signer | any;
  let investor2: Signer;
  let investor3: Signer;
  let investor4: Signer;

  let vendor: Signer | any;
  enum Category {
    Entrepreneur,
    Investor,
    Vendor,
  }
  const now = new Date().getTime();
  const fiveDaysFromNow = now + 1000 * 60 * 60 * 24 * 5;

  const dateFiveDaysFromNow = new Date(fiveDaysFromNow);

  // Deploy the contract and set up the necessary accounts
  before(async function () {
    const CampaignRegistry: ContractFactory = await ethers.getContractFactory("CampaignRegistry");
    [entrepreneur, investor1, investor2, investor3, investor4, vendor] = await ethers.getSigners();
    campaignRegistry = await upgrades.deployProxy(CampaignRegistry, {
      initializer: "initialize",
      kind: "uups",
    });
    await campaignRegistry.deployed();
  });

  describe("User Registration", function () {
    it("Should allow a user to register", async function () {
      // Register a user with email, password, and wallet address
      const email = "user@example.com";
      const password = "password";
      const category = Category.Entrepreneur;
      const investorCat = Category.Investor;
      const vendorCategory = Category.Vendor;
      const walletAddress = entrepreneur.address;
      await campaignRegistry.connect(entrepreneur).registerUser(email, password, category);
      await campaignRegistry.connect(investor1).registerUser(email, password, investorCat);
      await campaignRegistry.connect(investor2).registerUser(email, password, investorCat);
      await campaignRegistry.connect(investor3).registerUser(email, password, investorCat);
      await campaignRegistry.connect(investor4).registerUser(email, password, investorCat);
      await campaignRegistry.connect(vendor).registerUser(email, password, vendorCategory);

      const user = await campaignRegistry.getUserByAddress(walletAddress);
      expect(user.email).to.equal("user@example.com");
      expect(user.category).to.equal(0);
      expect(user.password).to.equal("password");
    });

    it("Should not allow a user to register with an existing email", async function () {
      // Try to register a user with an existing email
      const email = "user@example.com";
      const password = "password";
      const walletAddress = entrepreneur.address;

      // The registration should fail and throw an error
      await expect(campaignRegistry.registerUser(email, password, walletAddress)).to.be.reverted;
    });

    it("Should not allow a user to register with an invalid wallet address", async function () {
      // Try to register a user with an invalid wallet address
      const email = "user2@example.com";
      const password = "password";
      const walletAddress = ethers.constants.AddressZero;

      // The registration should fail and throw an error
      await expect(campaignRegistry.registerUser(email, password, walletAddress)).to.be.reverted;
    });
  });

  describe("User Login", function () {
    it("Should return true for a valid user login", async function () {
      // Perform a valid login with email and password
      const email = "user@example.com";
      const password = "password";

      const isLoggedIn = await campaignRegistry.loginUser(email, password);
      expect(isLoggedIn).to.be.true;
    });

    it("Should return false for an invalid user login", async function () {
      // Perform an invalid login with incorrect email or password
      const email = "user@example.com";
      const incorrectPassword = "incorrect";

      const isLoggedIn = await campaignRegistry.loginUser(email, incorrectPassword);

      expect(isLoggedIn).to.be.false;
    });
  });

  describe("Campaign Creation and donations", function () {
    it("should allow entrepreneur to create a campaign", async () => {
      const _targetAmount = 3000;
      const _deadline = new Date().getTime();
      const _minimumContribution = 200;
      const _image = "//https:url.com";
      const _campaignTitle = "Covid Support";
      const _campaignDescription = "for covid 5";
      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(_targetAmount, _deadline, _minimumContribution, _image, _campaignTitle, _campaignDescription);
      const _targetAmount2 = 4000;
      const _deadline2 = new Date().getTime();
      const _image2 = "//https:url.com";
      const _campaignTitle2 = "Scholarship Support";
      const _campaignDescription2 = "To support student that can not afford their school fees";
      const _minimumContribution2 = 200;

      await campaignRegistry
        .connect(entrepreneur)
        .createCampaign(
          _targetAmount2,
          _deadline2,
          _minimumContribution2,
          _image2,
          _campaignTitle2,
          _campaignDescription2,
        );
      const campaign = await campaignRegistry.campaigns(0);
      expect(campaign.campaignTitle.toString()).to.equal(_campaignTitle);
      expect(campaign.campaignDescription.toString()).to.equal(_campaignDescription);
      expect(campaign.status).to.equal(0); //  Campaign status: Ongoing
    });

    it("should get all created campaigns", async () => {
      const campaignTotal = await campaignRegistry.getCampaigns();
      expect(campaignTotal.length).to.equal(2);
    });

    it("should allow investors to donate to a campaign", async () => {
      await campaignRegistry.connect(investor1).donateToCampaign(0, { value: 1500 });
      await campaignRegistry.connect(investor2).donateToCampaign(0, { value: 500 });
      const campaign = await campaignRegistry.campaigns(0);
      expect(campaign.raisedAmount).to.equal(2000);
    });
    it("should get all investors and their donations for a campaign", async () => {
      await campaignRegistry.connect(investor3).donateToCampaign(1, { value: 1000 });
      await campaignRegistry.connect(investor4).donateToCampaign(1, { value: 1000 });

      const allDonors = await campaignRegistry.getAllDonators(0);
      expect(allDonors.length).to.equal(2);
      expect(allDonors[0]).to.equal(await investor1.getAddress());
      expect(allDonors[1]).to.equal(await investor2.getAddress());
      expect(allDonors[0]).to.equal("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      expect(allDonors[1]).to.equal("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
    });

    it("should get all donators", async () => {
      const donators = await campaignRegistry.getAllDonators(0);
      expect(donators.length).to.equal(2);
      expect(donators[0]).to.equal(await investor1.getAddress());
      expect(donators[1]).to.equal(await investor2.getAddress());
    });

    it("should get all donations", async () => {
      const donations = await campaignRegistry.getAllDonations(0);
      expect(donations.length).to.equal(2);
      expect(donations[0]).to.equal(1500);
      expect(donations[1]).to.equal(500);
    });

    it("should get the total number of donations made by  investors", async () => {
      const investorDonations = await campaignRegistry.getInvestorDonations(0);
      console.log({ investorDonations });
      expect(investorDonations.length).to.equal(2);
    });

    describe("Campaign request creation and approvals", function () {
      it("should allow entrepreneur to create a request for fund release", async () => {
        await campaignRegistry.connect(entrepreneur).createFundReleaseRequest(0, 500, vendor.address);

        const request = await campaignRegistry.campaigns(0);
        expect(request.vendor).to.equal(await vendor.getAddress());
        expect(request.requestAmount).to.equal(500);
        expect(request.requestCreated).to.equal(true);
      });

      it("should allow investor to approve funds to vendors when the campaign period is over and 50% of investors approve the request", async () => {
        await campaignRegistry.connect(investor1).approveFundReleaseRequest(0);
        await campaignRegistry.connect(investor2).approveFundReleaseRequest(0);
        const requestApproved = await campaignRegistry.connect(investor1).isRequestApprovedOrDeclined(0);
        console.log({ requestApproved });
        const approved = await campaignRegistry.campaigns(0);
        console.log({ approved });
        expect(approved.requestAmount).to.equal(500);
      });
    });
    describe("Campaign fund release and confirmation by vendor", function () {
      it("should allow entrepreneur to release the fund to the vendor when 50% of investors approve the request", async () => {
        const initialBalance = await ethers.provider.getBalance(vendor.address);
        const address = vendor.address;
        console.log({ address });
        await campaignRegistry.connect(entrepreneur).releaseFundsToVendors(0);
        const release = await campaignRegistry.campaigns(0);
        console.log({ release });
        const finalBalance = await ethers.provider.getBalance(vendor.address);
        console.log({ initialBalance, finalBalance });
        expect(finalBalance.sub(initialBalance)).to.equal(500);
      });
      it("should allow entrepreneur to release the fund to the vendor when 50% of investors approve the request", async () => {
        await campaignRegistry.connect(vendor).confirmFundsReceived(0);
        const confirmed = await campaignRegistry.campaigns(0);
        console.log(confirmed);

        expect(confirmed.fundsReceived).to.equal(true);
      });
      it("should allow investors to withdraw funds when the campaign is not successful", async () => {
        await campaignRegistry.makeCampaignExpired(0);
        await campaignRegistry.connect(investor2).withdrawFunds(0);
        const fundWithdraw = await campaignRegistry.campaigns(0);
        console.log(fundWithdraw);

        expect(fundWithdraw.fundsReceived).to.equal(true);
      });
    });
  });
});
