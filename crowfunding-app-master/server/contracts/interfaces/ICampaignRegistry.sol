// SPDX-License-Identifier: MIT
// pragma solidity ^0.4.22;
pragma solidity >=0.6.0 <0.9.0;

/*********************** Interface Definition *******************/

/**
 * @dev Interface of the Sytemap asset registry nft attribute.
 */
interface ICampaignRegistry {
    enum CampaignStatus { Ongoing, Successful, Expired }
    enum Category {Entrepreneur, Investor, Vendor}

    struct User {
        string email;
        string password;
        Category category;
        address walletAddress;
        bool verified;
    }

    struct Campaign {
        uint256 campaignId;
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 requestAmount;
        uint256 deadline;
        uint256 completeAt;
        uint256 minimumContribution;
        string imageUri;
        string campaignTitle;
        string campaignDescription;
        address entrepreneur;
        address payable vendor;
        address[] investors; 
        CampaignStatus status;
        bool requestCreated;
        bool fundsReceived;
    }

    /*********************** Events *******************/
    /**
     * @notice Emitted when a new user is registered and verified
     * @param email The campaign identifier
     * @param verified This shows whether user is a verified
     * @param walletAddress The walletAddress of the user, 
     */
     event UserRegistered(string email, bool verified, address walletAddress);

    /**
     * @notice Emitted when a new campaign is created
     * @param campaignId The campaign identifier
     * @param entrepreneur The enterpreneur creating the campaign
     * @param targetAmount The target amount to be acheived, 
     * @param deadline The deadline for the camapign
     */
     event CampaignCreated(uint campaignId, address entrepreneur, uint targetAmount, uint deadline);
      /**
     * @notice Emitted when a new contrbution is made.
     * @param campaignId The campaign id
     * @param investor The investor
     * @param amount The amount contributed 
     */
    event ContributionMade(uint campaignId, address investor, uint amount);
     /**
     * @notice Emitted when a request is mafe.
     * @param campaignId The campaign identifier
     * @param requestAmount The amount contributed
     */
    event RequestCreated(uint campaignId, uint requestAmount);
     /**
     * @notice Emitted when a fund is released
     * @param campaignId The campaign identifier
     * @param vendor The vendor that will receive the money
     * @param amount The amount requested
     */
    event FundsReleased(uint campaignId, address vendor, uint amount);

     /**
     * @notice Emitted when a fund release is requested by entrepenuer.
     * @param campaignId The campaign ID.
     * @param investor The investor that approve the request.
     */
    event RequestApproved(uint campaignId, address investor);

 /**
     * @notice Emitted when a fund is received by vendor.
     * @param campaignId The campaign ID.
     */
    event FundsReceived(uint campaignId);

    event FundsWithdrawn(uint256 campaignId, address investor);
    event FundReleaseDeclined(uint campaignId);


    /*********************** Interface Methods  *******************/

}
