// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PrizePool
 * @dev Individual prize pool contract with Chainlink VRF integration
 */
contract PrizePool is VRFConsumerBaseV2, ReentrancyGuard, Ownable {
    VRFCoordinatorV2Interface COORDINATOR;
    
    // VRF configuration
    bytes32 private constant KEY_HASH = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    uint32 private constant NUM_WORDS = 1;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant CALLBACK_GAS_LIMIT = 100000;
    uint64 private s_subscriptionId;
    
    // Pool configuration
    string public name;
    uint256 public minParticipation;
    uint256 public winProbability;
    uint256 public winProbabilityDenominator;
    uint256 public platformFeePercentage;
    uint256 public duration;
    uint256 public endTime;
    bool public isActive;
    
    // Pool state
    uint256 public totalParticipants;
    uint256 public totalWinnings;
    uint256 public platformFees;
    
    // Participant tracking
    struct Participant {
        address participant;
        uint256 amount;
        uint256 timestamp;
        bool hasWon;
        uint256 winnings;
    }
    
    mapping(uint256 => Participant) public participants;
    mapping(address => uint256[]) public userParticipations;
    
    // VRF request tracking
    mapping(uint256 => address) public requestToParticipant;
    mapping(uint256 => uint256) public requestToAmount;
    
    // Events
    event PoolCreated(string name, uint256 minParticipation, uint256 winProbability, uint256 platformFeePercentage);
    event Participation(address indexed participant, uint256 amount, uint256 participationId);
    event RandomnessRequested(uint256 requestId, address participant);
    event WinnerSelected(address indexed winner, uint256 amount, uint256 participationId);
    event PoolEnded(uint256 totalParticipants, uint256 totalWinnings);
    event PlatformFeesWithdrawn(address indexed owner, uint256 amount);
    
    constructor(
        string memory _name,
        uint256 _minParticipation,
        uint256 _winProbability,
        uint256 _winProbabilityDenominator,
        uint256 _platformFeePercentage,
        uint256 _duration,
        address _creator
    ) VRFConsumerBaseV2(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625) {
        COORDINATOR = VRFCoordinatorV2Interface(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625);
        
        name = _name;
        minParticipation = _minParticipation;
        winProbability = _winProbability;
        winProbabilityDenominator = _winProbabilityDenominator;
        platformFeePercentage = _platformFeePercentage;
        duration = _duration;
        endTime = _duration > 0 ? block.timestamp + _duration : 0;
        isActive = true;
        
        _transferOwnership(_creator);
        
        emit PoolCreated(_name, _minParticipation, _winProbability, _platformFeePercentage);
    }
    
    /**
     * @dev Participate in the prize pool
     */
    function participate() external payable nonReentrant {
        require(isActive, "Pool is not active");
        require(msg.value >= minParticipation, "Insufficient participation amount");
        require(endTime == 0 || block.timestamp < endTime, "Pool has ended");
        
        // Record participation
        uint256 participationId = totalParticipants;
        participants[participationId] = Participant({
            participant: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            hasWon: false,
            winnings: 0
        });
        
        userParticipations[msg.sender].push(participationId);
        totalParticipants++;
        
        emit Participation(msg.sender, msg.value, participationId);
        
        // Request random number for immediate result
        _requestRandomness(participationId, msg.value);
    }
    
    /**
     * @dev Request randomness from Chainlink VRF
     */
    function _requestRandomness(uint256 participationId, uint256 amount) internal {
        uint256 requestId = COORDINATOR.requestRandomWords(
            KEY_HASH,
            s_subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS
        );
        
        requestToParticipant[requestId] = msg.sender;
        requestToAmount[requestId] = amount;
        
        emit RandomnessRequested(requestId, msg.sender);
    }
    
    /**
     * @dev Callback function for VRF
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address participant = requestToParticipant[requestId];
        uint256 amount = requestToAmount[requestId];
        
        // Find the participation ID
        uint256 participationId = userParticipations[participant].length - 1;
        uint256 actualParticipationId = userParticipations[participant][participationId];
        
        // Check if participant won
        uint256 randomValue = randomWords[0] % winProbabilityDenominator;
        bool hasWon = randomValue < winProbability;
        
        if (hasWon) {
            // Calculate winnings (excluding platform fee)
            uint256 platformFee = (amount * platformFeePercentage) / 100;
            uint256 winnings = amount - platformFee;
            
            // Update participant record
            participants[actualParticipationId].hasWon = true;
            participants[actualParticipationId].winnings = winnings;
            
            totalWinnings += winnings;
            platformFees += platformFee;
            
            // Transfer winnings to participant
            (bool success, ) = participant.call{value: winnings}("");
            require(success, "Winnings transfer failed");
            
            emit WinnerSelected(participant, winnings, actualParticipationId);
        } else {
            // All amount goes to platform fees
            platformFees += amount;
        }
        
        // Check if pool should end
        if (endTime > 0 && block.timestamp >= endTime) {
            _endPool();
        }
    }
    
    /**
     * @dev End the pool manually
     */
    function endPool() external onlyOwner {
        require(isActive, "Pool already ended");
        _endPool();
    }
    
    /**
     * @dev Internal function to end the pool
     */
    function _endPool() internal {
        isActive = false;
        emit PoolEnded(totalParticipants, totalWinnings);
    }
    
    /**
     * @dev Withdraw platform fees
     */
    function withdrawPlatformFees() external onlyOwner {
        require(platformFees > 0, "No fees to withdraw");
        require(!isActive, "Pool still active");
        
        uint256 amount = platformFees;
        platformFees = 0;
        
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Fee withdrawal failed");
        
        emit PlatformFeesWithdrawn(owner(), amount);
    }
    
    /**
     * @dev Get pool information
     */
    function getPoolInfo() external view returns (
        string memory,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        bool
    ) {
        return (
            name,
            minParticipation,
            winProbability,
            winProbabilityDenominator,
            platformFeePercentage,
            totalParticipants,
            totalWinnings,
            platformFees,
            isActive
        );
    }
    
    /**
     * @dev Get participant information
     */
    function getParticipant(uint256 participationId) external view returns (Participant memory) {
        return participants[participationId];
    }
    
    /**
     * @dev Get user's participation history
     */
    function getUserParticipations(address user) external view returns (uint256[] memory) {
        return userParticipations[user];
    }
    
    /**
     * @dev Set VRF subscription ID (only owner)
     */
    function setSubscriptionId(uint64 subscriptionId) external onlyOwner {
        s_subscriptionId = subscriptionId;
    }
}
