// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PrizePool.sol";

/**
 * @title PoolFactory
 * @dev Factory contract for creating and managing prize pools
 */
contract PoolFactory {
    address[] public pools;
    mapping(address => bool) public isPool;
    mapping(address => address[]) public userPools;
    
    event PoolCreated(address indexed poolAddress, address indexed creator, string name);
    
    /**
     * @dev Create a new prize pool
     * @param name Name of the prize pool
     * @param minParticipation Minimum participation amount in wei
     * @param winProbability Numerator for win probability (e.g., 1 for 1/10)
     * @param winProbabilityDenominator Denominator for win probability (e.g., 10 for 1/10)
     * @param platformFeePercentage Platform fee percentage (e.g., 20 for 20%)
     * @param duration Duration in seconds (0 for no time limit)
     */
    function createPool(
        string memory name,
        uint256 minParticipation,
        uint256 winProbability,
        uint256 winProbabilityDenominator,
        uint256 platformFeePercentage,
        uint256 duration
    ) external payable returns (address) {
        require(msg.value > 0, "Initial funding required");
        require(minParticipation > 0, "Invalid min participation");
        require(winProbability > 0 && winProbability <= winProbabilityDenominator, "Invalid probability");
        require(platformFeePercentage <= 50, "Platform fee too high");
        
        PrizePool newPool = new PrizePool(
            name,
            minParticipation,
            winProbability,
            winProbabilityDenominator,
            platformFeePercentage,
            duration,
            msg.sender
        );
        
        address poolAddress = address(newPool);
        pools.push(poolAddress);
        isPool[poolAddress] = true;
        userPools[msg.sender].push(poolAddress);
        
        // Transfer initial funding to the pool
        (bool success, ) = poolAddress.call{value: msg.value}("");
        require(success, "Funding transfer failed");
        
        emit PoolCreated(poolAddress, msg.sender, name);
        return poolAddress;
    }
    
    /**
     * @dev Get all pools
     */
    function getAllPools() external view returns (address[] memory) {
        return pools;
    }
    
    /**
     * @dev Get pools created by a specific user
     */
    function getUserPools(address user) external view returns (address[] memory) {
        return userPools[user];
    }
    
    /**
     * @dev Get total number of pools
     */
    function getPoolCount() external view returns (uint256) {
        return pools.length;
    }
}
