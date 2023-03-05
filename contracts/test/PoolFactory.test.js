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
    await poolFactory.waitForDeployment();
  });

  describe("Pool Creation", function () {
    it("Should create a new pool with correct parameters", async function () {
      const name = "Test Pool";
      const minParticipation = ethers.parseEther("0.01");
      const winProbability = 10; // 10%
      const platformFeePercent = 5; // 5%
      const duration = 7 * 24 * 60 * 60; // 7 days
      const initialFunding = ethers.parseEther("0.1");

      const tx = await poolFactory.createPool(
        name,
        minParticipation,
        winProbability,
        platformFeePercent,
        duration,
        { value: initialFunding }
      );

      const receipt = await tx.wait();
      const poolCreatedEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === "PoolCreated"
      );

      expect(poolCreatedEvent).to.not.be.undefined;
      expect(await poolFactory.getPoolCount()).to.equal(1);
    });

    it("Should reject pool creation with invalid parameters", async function () {
      const name = "Invalid Pool";
      const minParticipation = 0; // Invalid
      const winProbability = 10;
      const platformFeePercent = 5;
      const duration = 7 * 24 * 60 * 60;
      const initialFunding = ethers.parseEther("0.1");

      await expect(
        poolFactory.createPool(
          name,
          minParticipation,
          winProbability,
          platformFeePercent,
          duration,
          { value: initialFunding }
        )
      ).to.be.revertedWith("Invalid min participation");
    });

    it("Should reject pool creation without initial funding", async function () {
      const name = "No Funding Pool";
      const minParticipation = ethers.parseEther("0.01");
      const winProbability = 10;
      const platformFeePercent = 5;
      const duration = 7 * 24 * 60 * 60;

      await expect(
        poolFactory.createPool(
          name,
          minParticipation,
          winProbability,
          platformFeePercent,
          duration
        )
      ).to.be.revertedWith("Initial funding required");
    });
  });

  describe("Pool Management", function () {
    it("Should return correct pool count", async function () {
      expect(await poolFactory.getPoolCount()).to.equal(0);
      
      // Create first pool
      await poolFactory.createPool(
        "Pool 1",
        ethers.parseEther("0.01"),
        10,
        5,
        7 * 24 * 60 * 60,
        { value: ethers.parseEther("0.1") }
      );
      
      expect(await poolFactory.getPoolCount()).to.equal(1);
      
      // Create second pool
      await poolFactory.createPool(
        "Pool 2",
        ethers.parseEther("0.02"),
        20,
        10,
        14 * 24 * 60 * 60,
        { value: ethers.parseEther("0.2") }
      );
      
      expect(await poolFactory.getPoolCount()).to.equal(2);
    });

    it("Should return all pools", async function () {
      const pools = await poolFactory.getPools();
      expect(pools.length).to.equal(0);
      
      await poolFactory.createPool(
        "Test Pool",
        ethers.parseEther("0.01"),
        10,
        5,
        7 * 24 * 60 * 60,
        { value: ethers.parseEther("0.1") }
      );
      
      const poolsAfter = await poolFactory.getPools();
      expect(poolsAfter.length).to.equal(1);
      expect(await poolFactory.isPool(poolsAfter[0])).to.be.true;
    });
  });
});
