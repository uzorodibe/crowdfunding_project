// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "hardhat/console.sol";
import "./interfaces/ICampaignRegistry.sol";

contract CampaignRegistry is ICampaignRegistry, Initializable, OwnableUpgradeable, UUPSUpgradeable {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    /*************** State attributes ***************/
    /**
     * @notice This is to track the number of campaign created.
     */
    uint256 private campaignIdCounter;

    /*********************** Mapping *******************/

    // This is to keep track of the number of investors donated to a campaign
    mapping(uint256 => uint256) private donationCount;

    /**
     * @dev mapping from User info to wallet address
     * @notice is one to many mapping, meaning that a single property could have more that one asset
     */
    mapping(address => User) public users;

    /**
     * @dev mapping from campaign infor to campaign number
     * @notice is one to many mapping, meaning that a single property could have more that one asset
     */
    mapping(uint256 => Campaign) public campaigns;

    // This mapping campaign id to map of address contributions
    mapping(uint256 => mapping(address => uint256)) private contributions;
    mapping(uint256 => mapping(address => bool)) private campaignInvestorApprovals;

    // Mapping from address to number of campaigns created by the address
    mapping(address => EnumerableSetUpgradeable.UintSet) private _campaignsOwnedByEntrepreneur;

    /*********************** Modifiers *******************/

    modifier onlyVerifiedUser() {
        require(users[msg.sender].verified, "Only verified users can participate");
        _;
    }

    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId < campaignIdCounter, "Campaign does not exist");
        _;
    }

    modifier onlyCategory(Category _category) {
        require(
            users[msg.sender].category == _category,
            "Only users of the specified category can perform this action"
        );
        _;
    }

    modifier validateExpiry(uint256 campaignId, CampaignStatus _status) {
        require(campaigns[campaignId].status == _status, "Campaign is not ongoing");
        require(block.timestamp < campaigns[campaignId].deadline, "Deadline has passed !");
        _;
    }

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    // ============ FUNCTION OVERRIDES ============
    function _authorizeUpgrade(address newImplementation) internal virtual override {}

    /*********************** External methods *******************/
    function registerUser(string memory _email, string memory _password, Category _category) external {
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(_password).length > 0, "Password cannot be empty");
        require(msg.sender != address(0), "Invalid wallet address");
        require(!users[msg.sender].verified, "User is already registered");

        users[msg.sender] = User(_email, _password, _category, msg.sender, true);
        emit UserRegistered(_email, true, msg.sender);
    }


    function createCampaign(
        uint256 _targetAmount,
        uint256 _deadline,
        uint256 minimumContribution,
        string memory _imageUri,
        string memory _campaignTitle,
        string memory _campaignDescription
    ) external onlyVerifiedUser onlyCategory(Category.Entrepreneur) {
        require(_targetAmount > 0, "Target amount must be greater than zero");

        Campaign storage campaign = campaigns[campaignIdCounter];
        require(campaign.deadline < block.timestamp, "The campaign must be a date in the future");
        uint256 campaignId = getCampaignCount();

        campaign.campaignId = campaignId;
        campaign.entrepreneur = msg.sender;
        campaign.targetAmount = _targetAmount;
        campaign.imageUri = _imageUri;
        campaign.campaignTitle = _campaignTitle;
        campaign.campaignDescription = _campaignDescription;
        campaign.deadline = _deadline;
        campaign.minimumContribution = minimumContribution;
        campaign.status = CampaignStatus.Ongoing;
        campaignIdCounter++;

        _addCampaignToEntrepreneurAddress(msg.sender, campaignId);
        emit CampaignCreated(campaignIdCounter - 1, msg.sender, _targetAmount, _deadline);
    }

    function donateToCampaign(
        uint256 _campaignId
    )
        external
        payable
        onlyVerifiedUser
        campaignExists(_campaignId)
        onlyCategory(Category.Investor)
        validateExpiry(_campaignId, CampaignStatus.Ongoing)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.Ongoing, "Campaign is not ongoing");
        require(block.timestamp < campaign.deadline, "Campaign period has ended");
        require(msg.value > 0, "Donation amount must be greater than zero");
        require(msg.value >= campaign.minimumContribution, "A minumum contribution is required.");
        require(!campaign.fundsReceived, "Funds for this campaign have already been received.");

        uint256 donationAmount = msg.value;

        contributions[_campaignId][msg.sender] += donationAmount;
        campaign.raisedAmount += donationAmount;
        donationCount[_campaignId]++;
        if (contributions[_campaignId][msg.sender] == donationAmount) {
            campaign.investors.push(msg.sender);
        }
        emit ContributionMade(_campaignId, msg.sender, msg.value);
        _checkFundingCompleteOrExpire(_campaignId);
    }

    function getCampaignCount() internal view returns (uint256) {
        return campaignIdCounter;
    }

    function getInvestorDonations(uint256 _campaignId) public view returns (address[] memory, uint256[] memory) {
        Campaign storage campaign = campaigns[_campaignId];

        uint256 investorCount = campaign.investors.length;
        address[] memory investors = new address[](investorCount);
        uint256[] memory donations = new uint256[](investorCount);

        for (uint256 i = 0; i < investorCount; i++) {
            address investor = campaign.investors[i];
            investors[i] = investor;
            donations[i] = contributions[_campaignId][investor];
        }

        return (investors, donations);
    }

    function getAllDonators(uint256 _campaignId) public view returns (address[] memory) {
        Campaign storage campaign = campaigns[_campaignId];

        return campaign.investors;
    }

    function getAllDonations(uint256 _campaignId) public view returns (uint256[] memory) {
        Campaign storage campaign = campaigns[_campaignId];

        uint256 investorCount = campaign.investors.length;
        uint256[] memory donations = new uint256[](investorCount);

        for (uint256 i = 0; i < investorCount; i++) {
            address investor = campaign.investors[i];
            donations[i] = contributions[_campaignId][investor];
        }

        return donations;
    }

    function getCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignIdCounter);

        for (uint256 i = 0; i < campaignIdCounter; ) {
            allCampaigns[i] = campaigns[i];
            unchecked {
                ++i;
            }
        }

        return allCampaigns;
    }

    function getCampaignById(uint256 _campaignId) public view returns (Campaign memory) {
        Campaign memory campaign = campaigns[_campaignId];
        return campaign;
    }

    function getUserByAddress(address _walltetAddress) public view returns (User memory) {
        User memory user = users[_walltetAddress];
        return user;
    }

    function getCampaignsByEntrepreneur(address _entrepreneur) public view returns (Campaign[] memory) {
        uint256 campaignIdsCount = _getEntrepreneurCampaignsCount(_entrepreneur);

        Campaign[] memory entrepreneurCampaigns = new Campaign[](campaignIdsCount);
        for (uint256 i = 0; i < campaignIdsCount; ) {
            uint256 campaignId = _campaignOfEntrepreneurByIndex(_entrepreneur, i);
            entrepreneurCampaigns[i] = campaigns[campaignId];
            unchecked {
                ++i;
            }
        }

        return entrepreneurCampaigns;
    }

    function getTotalCampaignsByInvestor(address _investor) external view returns (uint256) {
        uint256 totalCampaigns = 0;
        for (uint256 i = 0; i < campaignIdCounter; i++) {
            if (contributions[i][_investor] > 0) {
                totalCampaigns++;
            }
        }

        return totalCampaigns;
    }

    function createFundReleaseRequest(
        uint256 _campaignId,
        uint256 _requestAmount,
        address payable _vendorAddress
    ) external onlyVerifiedUser campaignExists(_campaignId) onlyCategory(Category.Entrepreneur) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.Successful, "Campaign is not completed");
        require(campaign.entrepreneur == msg.sender, "Only the entrepreneur can create a request");
        require(!_isRequestCreated(campaign), "A request has already been created for this campaign");
        require(
            _requestAmount <= campaign.raisedAmount,
            "Request amount must be less than or equal to the raised amount"
        );

        campaign.requestAmount = _requestAmount;
        campaign.requestCreated = true;
        campaign.vendor = _vendorAddress;

        emit RequestCreated(_campaignId, _requestAmount);
    }

    function approveFundReleaseRequest(
        uint256 _campaignId
    ) external onlyVerifiedUser campaignExists(_campaignId) onlyCategory(Category.Investor) {
        Campaign storage campaign = campaigns[_campaignId];
        require(contributions[_campaignId][msg.sender] > 0, "Only investors can approve a request");
        require(_isRequestCreated(campaign), "No request exists for this campaign");
        require(!campaignInvestorApprovals[_campaignId][msg.sender], "Investor has already approved the request");
        campaignInvestorApprovals[_campaignId][msg.sender] = true;
        emit RequestApproved(_campaignId, msg.sender);
    }

    function releaseFundsToVendors(
        uint256 _campaignId
    ) external onlyVerifiedUser campaignExists(_campaignId) onlyCategory(Category.Entrepreneur) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.Successful, "Campaign is not completed");
        require(_isRequestApproved(_campaignId), "Request has not been approved by the required number of investors");
        address vendor = campaigns[_campaignId].vendor;
        uint256 amountToRelease = campaigns[_campaignId].requestAmount;
        campaign.raisedAmount -= amountToRelease;

        campaigns[_campaignId].vendor.transfer(amountToRelease);
        campaign.status = CampaignStatus.Successful;
        _clearFundReleaseApprovals(_campaignId);

        emit FundsReleased(_campaignId, vendor, amountToRelease);
    }

    function confirmFundsReceived(
        uint _campaignId
    ) external onlyVerifiedUser campaignExists(_campaignId) onlyCategory(Category.Vendor) {
        Campaign storage campaign = campaigns[_campaignId];

        require(campaign.vendor == msg.sender, "Only the campaign vendor can confirm funds received.");
        require(!campaign.fundsReceived, "Funds for this campaign have already been received.");

        campaign.fundsReceived = true;

        emit FundsReceived(_campaignId);
    }

    function withdrawFunds(
        uint256 _campaignId
    ) external onlyVerifiedUser campaignExists(_campaignId) onlyCategory(Category.Investor) {
        Campaign storage campaign = campaigns[_campaignId];

        require(contributions[_campaignId][msg.sender] > 0, "You have not contributed to this campaign.");
        require(campaign.status == CampaignStatus.Expired, "Campaign has not expired yet.");
        require(campaign.deadline < block.timestamp, "Campaign deadline has not passed yet.");

        uint256 amountToWithdraw = contributions[_campaignId][msg.sender];
        contributions[_campaignId][msg.sender] = 0;

        payable(msg.sender).transfer(amountToWithdraw);

        emit FundsWithdrawn(_campaignId, msg.sender);
    }

    function declineFundRelease(
        uint256 _campaignId
    ) external onlyVerifiedUser campaignExists(_campaignId) onlyCategory(Category.Investor) {
        Campaign storage campaign = campaigns[_campaignId];

        require(contributions[_campaignId][msg.sender] > 0, "Only investors can decline a request");
        require(_isRequestCreated(campaign), "No request exists for this campaign");

        campaignInvestorApprovals[_campaignId][msg.sender] = false;

        emit FundReleaseDeclined(_campaignId);
    }

    function isRequestApprovedOrDeclined(
        uint256 _campaignId
    ) external view onlyVerifiedUser campaignExists(_campaignId) onlyCategory(Category.Investor) returns (bool) {
        bool isRequestApprovedOrDecline = campaignInvestorApprovals[_campaignId][msg.sender];
        if (isRequestApprovedOrDecline) {
            return true;
        }
        return false;
    }

    function makeCampaignExpired(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];

        require(campaign.deadline < block.timestamp, "Campaign deadline has not passed yet.");

        campaign.status = CampaignStatus.Expired;
    }

    /*********************** Internal methods *******************/

    function _clearFundReleaseApprovals(uint _campaignId) private {
        Campaign storage _campaign = campaigns[_campaignId];
        uint256 totalInvestorCount = _campaign.investors.length;

        for (uint256 i = 0; i < totalInvestorCount; i++) {
            address investor = _campaign.investors[i];
            campaignInvestorApprovals[_campaignId][investor] = false;
        }
    }

   function _checkFundingCompleteOrExpire(uint256 _campaignId) internal {
         if (campaigns[_campaignId].raisedAmount >= campaigns[_campaignId].targetAmount) {
            campaigns[_campaignId].status = CampaignStatus.Successful;
            campaigns[_campaignId].completeAt = block.timestamp;
        } else if (block.timestamp > campaigns[_campaignId].deadline ){
            campaigns[_campaignId].status = CampaignStatus.Expired;
        }
    }
    function _isRequestCreated(Campaign storage _campaign) private view returns (bool) {
        return _campaign.requestCreated;
    }

    function _isRequestApproved(uint256 _campaignId) private view returns (bool) {
        Campaign storage _campaign = campaigns[_campaignId];
        uint256 totalDonationsCount = donationCount[_campaign.campaignId];
        uint256 approvalsRequired = totalDonationsCount / 2; // At least 50% of investors must approve the fund release request
        uint256 approvedInvestorCount = 0;
        uint256 totalInvestorCount = _campaign.investors.length;

        for (uint256 i = 0; i < totalInvestorCount; i++) {
            address investor = _campaign.investors[i];
            bool isApprovedByInvestor = _getInvestorApproval(_campaignId, investor);
            if (isApprovedByInvestor) {
                approvedInvestorCount++;
            }
        }
        return approvedInvestorCount >= approvalsRequired;
    }

    function _getInvestorApproval(uint256 _campaignId, address _investor) internal view returns (bool) {
        return campaignInvestorApprovals[_campaignId][_investor];
    }

    function _getEntrepreneurCampaignsCount(address _entrepreneur) private view returns (uint256) {
        return _campaignsOwnedByEntrepreneur[_entrepreneur].length();
    }

    /**
     * @dev Private function to add a campaign id to this entrepreneur address-tracking data structures.
     * @param _entrepreneurId address representing the new owner of the given token ID
     * @param _campaignId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addCampaignToEntrepreneurAddress(address _entrepreneurId, uint256 _campaignId) private {
        _campaignsOwnedByEntrepreneur[_entrepreneurId].add(_campaignId);
    }

    function _campaignOfEntrepreneurByIndex(address _owner, uint256 index) public view returns (uint256) {
        return _campaignsOwnedByEntrepreneur[_owner].at(index);
    }
}
