// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PrizePool.sol";

contract PoolFactory {
    address[] public pools;
    mapping(address => bool) public isPool;
    
    event PoolCreated(address indexed poolAddress, address indexed creator, string name);
    
    function createPool(
        string memory _name,
        uint256 _minParticipation,
        uint256 _winProbability,
        uint256 _platformFeePercent,
        uint256 _duration
    ) external payable returns (address) {
        require(msg.value > 0, "Initial funding required");
        require(_minParticipation > 0, "Invalid min participation");
        require(_winProbability > 0 && _winProbability <= 100, "Invalid win probability");
        require(_platformFeePercent <= 20, "Platform fee too high");
        
        PrizePool newPool = new PrizePool(
            _name,
            _minParticipation,
            _winProbability,
            _platformFeePercent,
            _duration,
            msg.sender
        );
        
        address poolAddress = address(newPool);
        pools.push(poolAddress);
        isPool[poolAddress] = true;
        
        // Transfer initial funding to the pool
        (bool success, ) = poolAddress.call{value: msg.value}("");
        require(success, "Initial funding failed");
        
        emit PoolCreated(poolAddress, msg.sender, _name);
        return poolAddress;
    }
    
    function getPools() external view returns (address[] memory) {
        return pools;
    }
    
    function getPoolCount() external view returns (uint256) {
        return pools.length;
    }
}
