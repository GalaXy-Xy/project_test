const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PoolFactory", function () {
  let poolFactory;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const PoolFactory = await ethers.getContractFactory("PoolFactory");
    poolFactory = await PoolFactory.deploy();
    await poolFactory.deployed();
  });

  describe("Pool Creation", function () {
    it("Should create a new pool successfully", async function () {
      const name = "Test Pool";
      const minParticipation = ethers.utils.parseEther("0.01");
      const winProbability = 1;
      const winProbabilityDenominator = 10;
      const platformFeePercentage = 20;
      const duration = 0;
      const initialFunding = ethers.utils.parseEther("0.1");

      await expect(
        poolFactory.connect(addr1).createPool(
          name,
          minParticipation,
          winProbability,
          winProbabilityDenominator,
          platformFeePercentage,
          duration,
          { value: initialFunding }
        )
      ).to.emit(poolFactory, "PoolCreated");

      const poolCount = await poolFactory.getPoolCount();
      expect(poolCount).to.equal(1);
    });

    it("Should reject pool creation with zero initial funding", async function () {
      const name = "Test Pool";
      const minParticipation = ethers.utils.parseEther("0.01");
      const winProbability = 1;
      const winProbabilityDenominator = 10;
      const platformFeePercentage = 20;
      const duration = 0;

      await expect(
        poolFactory.connect(addr1).createPool(
          name,
          minParticipation,
          winProbability,
          winProbabilityDenominator,
          platformFeePercentage,
          duration,
          { value: 0 }
        )
      ).to.be.revertedWith("Initial funding required");
    });

    it("Should reject pool creation with invalid probability", async function () {
      const name = "Test Pool";
      const minParticipation = ethers.utils.parseEther("0.01");
      const winProbability = 11; // Invalid: > denominator
      const winProbabilityDenominator = 10;
      const platformFeePercentage = 20;
      const duration = 0;
      const initialFunding = ethers.utils.parseEther("0.1");

      await expect(
        poolFactory.connect(addr1).createPool(
          name,
          minParticipation,
          winProbability,
          winProbabilityDenominator,
          platformFeePercentage,
          duration,
          { value: initialFunding }
        )
      ).to.be.revertedWith("Invalid probability");
    });

    it("Should reject pool creation with platform fee too high", async function () {
      const name = "Test Pool";
      const minParticipation = ethers.utils.parseEther("0.01");
      const winProbability = 1;
      const winProbabilityDenominator = 10;
      const platformFeePercentage = 60; // Too high
      const duration = 0;
      const initialFunding = ethers.utils.parseEther("0.1");

      await expect(
        poolFactory.connect(addr1).createPool(
          name,
          minParticipation,
          winProbability,
          winProbabilityDenominator,
          platformFeePercentage,
          duration,
          { value: initialFunding }
        )
      ).to.be.revertedWith("Platform fee too high");
    });
  });

  describe("Pool Management", function () {
    beforeEach(async function () {
      const name = "Test Pool";
      const minParticipation = ethers.utils.parseEther("0.01");
      const winProbability = 1;
      const winProbabilityDenominator = 10;
      const platformFeePercentage = 20;
      const duration = 0;
      const initialFunding = ethers.utils.parseEther("0.1");

      await poolFactory.connect(addr1).createPool(
        name,
        minParticipation,
        winProbability,
        winProbabilityDenominator,
        platformFeePercentage,
        duration,
        { value: initialFunding }
      );
    });

    it("Should return correct pool count", async function () {
      const poolCount = await poolFactory.getPoolCount();
      expect(poolCount).to.equal(1);
    });

    it("Should return all pools", async function () {
      const pools = await poolFactory.getAllPools();
      expect(pools.length).to.equal(1);
      expect(pools[0]).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should return user pools", async function () {
      const userPools = await poolFactory.getUserPools(addr1.address);
      expect(userPools.length).to.equal(1);
    });

    it("Should identify pool correctly", async function () {
      const pools = await poolFactory.getAllPools();
      const isPool = await poolFactory.isPool(pools[0]);
      expect(isPool).to.be.true;
    });
  });
});
