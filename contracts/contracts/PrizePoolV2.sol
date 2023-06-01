// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract PrizePoolV2 is VRFConsumerBase, ReentrancyGuard, Ownable, Pausable {
    struct Participant {
        address user;
        uint256 amount;
        uint256 timestamp;
        bool hasWon;
        uint256 reward;
        uint256 requestId;
    }
    
    struct PoolConfig {
        string name;
        uint256 minParticipation;
        uint256 winProbability;
        uint256 platformFeePercent;
        uint256 endTime;
        bool isActive;
        uint256 maxParticipants;
        uint256 maxParticipationPerUser;
    }
    
    PoolConfig public config;
    uint256 public totalParticipants;
    uint256 public totalRewards;
    uint256 public platformFees;
    uint256 public constant MAX_PLATFORM_FEE = 20; // 20%
    uint256 public constant MAX_WIN_PROBABILITY = 100; // 100%
    
    mapping(address => Participant[]) public userHistory;
    mapping(uint256 => address) public requestToUser;
    mapping(address => uint256) public userParticipationCount;
    mapping(address => uint256) public userTotalParticipation;
    
    // Chainlink VRF
    bytes32 internal keyHash;
    uint256 internal fee;
    
    event PoolCreated(
        string name,
        uint256 minParticipation,
        uint256 winProbability,
        uint256 platformFeePercent,
        uint256 endTime
    );
    event Participation(address indexed user, uint256 amount, uint256 requestId);
    event Winner(address indexed user, uint256 reward, uint256 randomNumber);
    event PoolEnded(uint256 totalRewards, uint256 platformFees);
    event PoolPaused(address indexed by);
    event PoolUnpaused(address indexed by);
    event EmergencyWithdraw(address indexed to, uint256 amount);
    
    constructor(
        string memory _name,
        uint256 _minParticipation,
        uint256 _winProbability,
        uint256 _platformFeePercent,
        uint256 _duration,
        uint256 _maxParticipants,
        uint256 _maxParticipationPerUser,
        address _owner
    ) VRFConsumerBase(
        0xb3dCcb4Cf7a26f6cf6Bd1a2F07dD6C1b0C6cc383, // VRF Coordinator
        0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK Token
    ) {
        require(_minParticipation > 0, "Invalid min participation");
        require(_winProbability > 0 && _winProbability <= MAX_WIN_PROBABILITY, "Invalid win probability");
        require(_platformFeePercent <= MAX_PLATFORM_FEE, "Platform fee too high");
        require(_maxParticipants > 0, "Invalid max participants");
        require(_maxParticipationPerUser > 0, "Invalid max participation per user");
        
        config = PoolConfig({
            name: _name,
            minParticipation: _minParticipation,
            winProbability: _winProbability,
            platformFeePercent: _platformFeePercent,
            endTime: block.timestamp + _duration,
            isActive: true,
            maxParticipants: _maxParticipants,
            maxParticipationPerUser: _maxParticipationPerUser
        });
        
        _transferOwnership(_owner);
        
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10**18; // 0.1 LINK
        
        emit PoolCreated(_name, _minParticipation, _winProbability, _platformFeePercent, config.endTime);
    }
    
    function participate() external payable nonReentrant whenNotPaused {
        require(config.isActive, "Pool is not active");
        require(block.timestamp < config.endTime, "Pool has ended");
        require(msg.value >= config.minParticipation, "Insufficient participation amount");
        require(totalParticipants < config.maxParticipants, "Pool is full");
        require(userParticipationCount[msg.sender] < config.maxParticipationPerUser, "Max participation per user exceeded");
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        
        uint256 requestId = requestRandomness(keyHash, fee);
        requestToUser[requestId] = msg.sender;
        
        userParticipationCount[msg.sender]++;
        userTotalParticipation[msg.sender] += msg.value;
        
        emit Participation(msg.sender, msg.value, requestId);
    }
    
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        address user = requestToUser[uint256(requestId)];
        require(user != address(0), "Invalid request");
        
        bool hasWon = (randomness % 100) < config.winProbability;
        uint256 reward = 0;
        
        if (hasWon) {
            uint256 platformFee = (address(this).balance * config.platformFeePercent) / 100;
            reward = address(this).balance - platformFee;
            platformFees += platformFee;
            totalRewards += reward;
            
            (bool success, ) = user.call{value: reward}("");
            require(success, "Reward transfer failed");
        }
        
        userHistory[user].push(Participant({
            user: user,
            amount: msg.value,
            timestamp: block.timestamp,
            hasWon: hasWon,
            reward: reward,
            requestId: uint256(requestId)
        }));
        
        totalParticipants++;
        
        if (hasWon) {
            emit Winner(user, reward, randomness);
        }
    }
    
    function endPool() external onlyOwner {
        require(config.isActive, "Pool already ended");
        require(block.timestamp >= config.endTime, "Pool not yet expired");
        
        config.isActive = false;
        emit PoolEnded(totalRewards, platformFees);
    }
    
    function pausePool() external onlyOwner {
        _pause();
        emit PoolPaused(msg.sender);
    }
    
    function unpausePool() external onlyOwner {
        _unpause();
        emit PoolUnpaused(msg.sender);
    }
    
    function withdrawPlatformFees() external onlyOwner {
        require(platformFees > 0, "No fees to withdraw");
        uint256 amount = platformFees;
        platformFees = 0;
        
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Fee withdrawal failed");
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Emergency withdrawal failed");
        
        emit EmergencyWithdraw(owner(), amount);
    }
    
    function getUserHistory(address user) external view returns (Participant[] memory) {
        return userHistory[user];
    }
    
    function getUserStats(address user) external view returns (
        uint256 participationCount,
        uint256 totalAmount,
        uint256 winCount,
        uint256 totalRewards
    ) {
        participationCount = userParticipationCount[user];
        totalAmount = userTotalParticipation[user];
        
        Participant[] memory history = userHistory[user];
        for (uint256 i = 0; i < history.length; i++) {
            if (history[i].hasWon) {
                winCount++;
                totalRewards += history[i].reward;
            }
        }
    }
    
    function getPoolInfo() external view returns (
        string memory,
        uint256,
        uint256,
        uint256,
        uint256,
        bool,
        uint256,
        uint256,
        uint256
    ) {
        return (
            config.name,
            config.minParticipation,
            config.winProbability,
            address(this).balance,
            totalParticipants,
            config.isActive,
            config.endTime,
            config.maxParticipants,
            config.maxParticipationPerUser
        );
    }
    
    function getPoolConfig() external view returns (PoolConfig memory) {
        return config;
    }
}