const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Integration Tests", function () {
  let poolFactory;
  let owner;
  let addr1;
  let addr2;
  let vrfCoordinator;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy VRF Coordinator mock
    const VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorV2Mock");
    vrfCoordinator = await VRFCoordinatorMock.deploy(
      ethers.utils.parseEther("0.1"),
      ethers.utils.parseEther("0.0001")
    );
    await vrfCoordinator.deployed();

    // Create subscription
    const tx = await vrfCoordinator.createSubscription();
    const receipt = await tx.wait();
    const subscriptionId = receipt.events[0].args.subId;

    // Deploy PoolFactory
    const PoolFactory = await ethers.getContractFactory("PoolFactory");
    poolFactory = await PoolFactory.deploy();
    await poolFactory.deployed();
  });

  describe("Complete Pool Lifecycle", function () {
    it("Should create pool, participate, and manage complete lifecycle", async function () {
      // Step 1: Create a pool
      const createPoolTx = await poolFactory.connect(addr1).createPool(
        "Integration Test Pool",
        ethers.utils.parseEther("0.01"),
        1, 10, 20, 0,
        { value: ethers.utils.parseEther("0.1") }
      );

      const createPoolReceipt = await createPoolTx.wait();
      const poolCreatedEvent = createPoolReceipt.events.find(e => e.event === 'PoolCreated');
      const poolAddress = poolCreatedEvent.args.poolAddress;

      expect(poolAddress).to.not.equal(ethers.constants.AddressZero);
      expect(await poolFactory.isPool(poolAddress)).to.be.true;

      // Step 2: Get pool contract
      const PrizePool = await ethers.getContractFactory("PrizePool");
      const prizePool = PrizePool.attach(poolAddress);

      // Step 3: Verify pool info
      const poolInfo = await prizePool.getPoolInfo();
      expect(poolInfo[0]).to.equal("Integration Test Pool");
      expect(poolInfo[1]).to.equal(ethers.utils.parseEther("0.01"));
      expect(poolInfo[8]).to.be.true; // isActive

      // Step 4: Multiple users participate
      await prizePool.connect(addr1).participate({ 
        value: ethers.utils.parseEther("0.01") 
      });
      await prizePool.connect(addr2).participate({ 
        value: ethers.utils.parseEther("0.02") 
      });

      expect(await prizePool.totalParticipants()).to.equal(2);

      // Step 5: Check user participations
      const addr1Participations = await prizePool.getUserParticipations(addr1.address);
      const addr2Participations = await prizePool.getUserParticipations(addr2.address);

      expect(addr1Participations.length).to.equal(1);
      expect(addr2Participations.length).to.equal(1);

      // Step 6: End pool
      await prizePool.connect(owner).endPool();
      const finalPoolInfo = await prizePool.getPoolInfo();
      expect(finalPoolInfo[8]).to.be.false; // isActive

      // Step 7: Withdraw platform fees
      const initialBalance = await owner.getBalance();
      await prizePool.connect(owner).withdrawPlatformFees();
      const finalBalance = await owner.getBalance();

      expect(finalBalance).to.be.gt(initialBalance);
    });
  });

  describe("Multiple Pool Management", function () {
    it("Should create and manage multiple pools", async function () {
      // Create first pool
      const pool1Tx = await poolFactory.connect(addr1).createPool(
        "Pool 1",
        ethers.utils.parseEther("0.01"),
        1, 10, 20, 0,
        { value: ethers.utils.parseEther("0.1") }
      );
      const pool1Receipt = await pool1Tx.wait();
      const pool1Address = pool1Receipt.events.find(e => e.event === 'PoolCreated').args.poolAddress;

      // Create second pool
      const pool2Tx = await poolFactory.connect(addr2).createPool(
        "Pool 2",
        ethers.utils.parseEther("0.02"),
        1, 5, 15, 3600, // 1 hour duration
        { value: ethers.utils.parseEther("0.2") }
      );
      const pool2Receipt = await pool2Tx.wait();
      const pool2Address = pool2Receipt.events.find(e => e.event === 'PoolCreated').args.poolAddress;

      // Verify both pools exist
      expect(await poolFactory.isPool(pool1Address)).to.be.true;
      expect(await poolFactory.isPool(pool2Address)).to.be.true;

      // Get all pools
      const allPools = await poolFactory.getAllPools();
      expect(allPools.length).to.equal(2);
      expect(allPools).to.include(pool1Address);
      expect(allPools).to.include(pool2Address);

      // Get user pools
      const addr1Pools = await poolFactory.getUserPools(addr1.address);
      const addr2Pools = await poolFactory.getUserPools(addr2.address);

      expect(addr1Pools.length).to.equal(1);
      expect(addr2Pools.length).to.equal(1);
      expect(addr1Pools[0]).to.equal(pool1Address);
      expect(addr2Pools[0]).to.equal(pool2Address);
    });
  });

  describe("Error Handling", function () {
    it("Should handle invalid pool creation parameters", async function () {
      // Test with zero initial funding
      await expect(
        poolFactory.connect(addr1).createPool(
          "Invalid Pool",
          ethers.utils.parseEther("0.01"),
          1, 10, 20, 0,
          { value: 0 }
        )
      ).to.be.revertedWith("Initial funding required");

      // Test with invalid probability
      await expect(
        poolFactory.connect(addr1).createPool(
          "Invalid Pool",
          ethers.utils.parseEther("0.01"),
          11, 10, 20, 0,
          { value: ethers.utils.parseEther("0.1") }
        )
      ).to.be.revertedWith("Invalid probability");

      // Test with high platform fee
      await expect(
        poolFactory.connect(addr1).createPool(
          "Invalid Pool",
          ethers.utils.parseEther("0.01"),
          1, 10, 60, 0,
          { value: ethers.utils.parseEther("0.1") }
        )
      ).to.be.revertedWith("Platform fee too high");
    });
  });

  describe("Gas Optimization", function () {
    it("Should use reasonable gas for operations", async function () {
      // Create pool and measure gas
      const createPoolTx = await poolFactory.connect(addr1).createPool(
        "Gas Test Pool",
        ethers.utils.parseEther("0.01"),
        1, 10, 20, 0,
        { value: ethers.utils.parseEther("0.1") }
      );
      const createPoolReceipt = await createPoolTx.wait();

      // Gas should be reasonable (less than 500k)
      expect(createPoolReceipt.gasUsed).to.be.lt(500000);

      // Get pool and test participation gas
      const poolAddress = createPoolReceipt.events.find(e => e.event === 'PoolCreated').args.poolAddress;
      const PrizePool = await ethers.getContractFactory("PrizePool");
      const prizePool = PrizePool.attach(poolAddress);

      const participateTx = await prizePool.connect(addr2).participate({
        value: ethers.utils.parseEther("0.01")
      });
      const participateReceipt = await participateTx.wait();

      // Participation gas should be reasonable (less than 200k)
      expect(participateReceipt.gasUsed).to.be.lt(200000);
    });
  });
});
