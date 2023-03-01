// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PrizePool is VRFConsumerBase, ReentrancyGuard, Ownable {
    struct Participant {
        address user;
        uint256 amount;
        uint256 timestamp;
        bool hasWon;
        uint256 reward;
    }
    
    string public name;
    uint256 public minParticipation;
    uint256 public winProbability; // 1-100
    uint256 public platformFeePercent;
    uint256 public endTime;
    bool public isActive;
    
    uint256 public totalParticipants;
    uint256 public totalRewards;
    uint256 public platformFees;
    
    mapping(address => Participant[]) public userHistory;
    mapping(uint256 => address) public requestToUser;
    
    // Chainlink VRF
    bytes32 internal keyHash;
    uint256 internal fee;
    
    event PoolCreated(string name, uint256 minParticipation, uint256 winProbability);
    event Participation(address indexed user, uint256 amount, uint256 requestId);
    event Winner(address indexed user, uint256 reward, uint256 randomNumber);
    event PoolEnded(uint256 totalRewards, uint256 platformFees);
    
    constructor(
        string memory _name,
        uint256 _minParticipation,
        uint256 _winProbability,
        uint256 _platformFeePercent,
        uint256 _duration,
        address _owner
    ) VRFConsumerBase(
        0xb3dCcb4Cf7a26f6cf6Bd1a2F07dD6C1b0C6cc383, // VRF Coordinator
        0x01BE23585060835E02B77ef475b0Cc51aA1e0709  // LINK Token
    ) {
        name = _name;
        minParticipation = _minParticipation;
        winProbability = _winProbability;
        platformFeePercent = _platformFeePercent;
        endTime = block.timestamp + _duration;
        isActive = true;
        _transferOwnership(_owner);
        
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10**18; // 0.1 LINK
        
        emit PoolCreated(_name, _minParticipation, _winProbability);
    }
    
    function participate() external payable nonReentrant {
        require(isActive, "Pool is not active");
        require(block.timestamp < endTime, "Pool has ended");
        require(msg.value >= minParticipation, "Insufficient participation amount");
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        
        uint256 requestId = requestRandomness(keyHash, fee);
        requestToUser[requestId] = msg.sender;
        
        emit Participation(msg.sender, msg.value, requestId);
    }
    
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        address user = requestToUser[uint256(requestId)];
        require(user != address(0), "Invalid request");
        
        bool hasWon = (randomness % 100) < winProbability;
        uint256 reward = 0;
        
        if (hasWon) {
            uint256 platformFee = (address(this).balance * platformFeePercent) / 100;
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
            reward: reward
        }));
        
        totalParticipants++;
        
        if (hasWon) {
            emit Winner(user, reward, randomness);
        }
    }
    
    function endPool() external onlyOwner {
        require(isActive, "Pool already ended");
        require(block.timestamp >= endTime, "Pool not yet expired");
        
        isActive = false;
        emit PoolEnded(totalRewards, platformFees);
    }
    
    function withdrawPlatformFees() external onlyOwner {
        require(platformFees > 0, "No fees to withdraw");
        uint256 amount = platformFees;
        platformFees = 0;
        
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Fee withdrawal failed");
    }
    
    function getUserHistory(address user) external view returns (Participant[] memory) {
        return userHistory[user];
    }
    
    function getPoolInfo() external view returns (
        string memory,
        uint256,
        uint256,
        uint256,
        uint256,
        bool,
        uint256
    ) {
        return (
            name,
            minParticipation,
            winProbability,
            address(this).balance,
            totalParticipants,
            isActive,
            endTime
        );
    }
}
