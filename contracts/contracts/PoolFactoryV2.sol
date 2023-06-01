// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PrizePoolV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PoolFactoryV2 is Ownable, ReentrancyGuard {
    address[] public pools;
    mapping(address => bool) public isPool;
    mapping(address => address[]) public creatorPools;
    
    uint256 public platformFeePercent = 2; // 2% default platform fee
    uint256 public maxPoolsPerCreator = 10;
    uint256 public minPoolDuration = 1 days;
    uint256 public maxPoolDuration = 365 days;
    
    event PoolCreated(
        address indexed poolAddress,
        address indexed creator,
        string name,
        uint256 minParticipation,
        uint256 winProbability,
        uint256 platformFeePercent,
        uint256 duration
    );
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event MaxPoolsPerCreatorUpdated(uint256 oldMax, uint256 newMax);
    event PoolDurationLimitsUpdated(uint256 minDuration, uint256 maxDuration);
    
    constructor() {
        _transferOwnership(msg.sender);
    }
    
    function createPool(
        string memory _name,
        uint256 _minParticipation,
        uint256 _winProbability,
        uint256 _poolPlatformFeePercent,
        uint256 _duration,
        uint256 _maxParticipants,
        uint256 _maxParticipationPerUser
    ) external payable nonReentrant returns (address) {
        require(msg.value > 0, "Initial funding required");
        require(_minParticipation > 0, "Invalid min participation");
        require(_winProbability > 0 && _winProbability <= 100, "Invalid win probability");
        require(_poolPlatformFeePercent <= 20, "Pool platform fee too high");
        require(_duration >= minPoolDuration && _duration <= maxPoolDuration, "Invalid duration");
        require(_maxParticipants > 0, "Invalid max participants");
        require(_maxParticipationPerUser > 0, "Invalid max participation per user");
        require(creatorPools[msg.sender].length < maxPoolsPerCreator, "Max pools per creator exceeded");
        
        PrizePoolV2 newPool = new PrizePoolV2(
            _name,
            _minParticipation,
            _winProbability,
            _poolPlatformFeePercent,
            _duration,
            _maxParticipants,
            _maxParticipationPerUser,
            msg.sender
        );
        
        address poolAddress = address(newPool);
        pools.push(poolAddress);
        isPool[poolAddress] = true;
        creatorPools[msg.sender].push(poolAddress);
        
        // Transfer initial funding to the pool
        (bool success, ) = poolAddress.call{value: msg.value}("");
        require(success, "Initial funding failed");
        
        emit PoolCreated(
            poolAddress,
            msg.sender,
            _name,
            _minParticipation,
            _winProbability,
            _poolPlatformFeePercent,
            _duration
        );
        
        return poolAddress;
    }
    
    function getPools() external view returns (address[] memory) {
        return pools;
    }
    
    function getPoolCount() external view returns (uint256) {
        return pools.length;
    }
    
    function getCreatorPools(address creator) external view returns (address[] memory) {
        return creatorPools[creator];
    }
    
    function getCreatorPoolCount(address creator) external view returns (uint256) {
        return creatorPools[creator].length;
    }
    
    function getActivePools() external view returns (address[] memory) {
        address[] memory activePools = new address[](pools.length);
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < pools.length; i++) {
            try PrizePoolV2(pools[i]).getPoolInfo() returns (
                string memory,
                uint256,
                uint256,
                uint256,
                uint256,
                bool isActive,
                uint256,
                uint256,
                uint256
            ) {
                if (isActive) {
                    activePools[activeCount] = pools[i];
                    activeCount++;
                }
            } catch {
                // Skip pools that can't be queried
                continue;
            }
        }
        
        // Resize array to actual active count
        address[] memory result = new address[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activePools[i];
        }
        
        return result;
    }
    
    function setPlatformFeePercent(uint256 _platformFeePercent) external onlyOwner {
        require(_platformFeePercent <= 10, "Platform fee too high");
        uint256 oldFee = platformFeePercent;
        platformFeePercent = _platformFeePercent;
        emit PlatformFeeUpdated(oldFee, _platformFeePercent);
    }
    
    function setMaxPoolsPerCreator(uint256 _maxPoolsPerCreator) external onlyOwner {
        require(_maxPoolsPerCreator > 0, "Invalid max pools per creator");
        uint256 oldMax = maxPoolsPerCreator;
        maxPoolsPerCreator = _maxPoolsPerCreator;
        emit MaxPoolsPerCreatorUpdated(oldMax, _maxPoolsPerCreator);
    }
    
    function setPoolDurationLimits(uint256 _minDuration, uint256 _maxDuration) external onlyOwner {
        require(_minDuration > 0, "Invalid min duration");
        require(_maxDuration > _minDuration, "Max duration must be greater than min duration");
        minPoolDuration = _minDuration;
        maxPoolDuration = _maxDuration;
        emit PoolDurationLimitsUpdated(_minDuration, _maxDuration);
    }
    
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No platform fees to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Platform fee withdrawal failed");
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }
}
