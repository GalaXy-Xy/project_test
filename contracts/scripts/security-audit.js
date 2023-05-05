const { ethers } = require("hardhat");

async function main() {
  console.log("Running security audit checks...");

  const auditResults = {
    timestamp: new Date().toISOString(),
    checks: [],
    vulnerabilities: [],
    recommendations: []
  };

  try {
    // Check 1: Reentrancy Protection
    console.log("1. Checking reentrancy protection...");
    const PoolFactory = await ethers.getContractFactory("PoolFactory");
    const poolFactory = await PoolFactory.deploy();
    await poolFactory.deployed();

    const sourceCode = await ethers.provider.getCode(poolFactory.address);
    const hasReentrancyGuard = sourceCode.includes("ReentrancyGuard");
    
    auditResults.checks.push({
      name: "Reentrancy Protection",
      status: hasReentrancyGuard ? "PASS" : "FAIL",
      details: hasReentrancyGuard ? "ReentrancyGuard imported and used" : "Missing reentrancy protection"
    });

    if (!hasReentrancyGuard) {
      auditResults.vulnerabilities.push({
        severity: "HIGH",
        issue: "Missing reentrancy protection",
        recommendation: "Import and use OpenZeppelin's ReentrancyGuard"
      });
    }

    // Check 2: Access Control
    console.log("2. Checking access control...");
    const PrizePool = await ethers.getContractFactory("PrizePool");
    const prizePool = await PrizePool.deploy(
      "Audit Test Pool",
      ethers.utils.parseEther("0.01"),
      1, 10, 20, 0,
      ethers.constants.AddressZero
    );
    await prizePool.deployed();

    const hasOwnable = await prizePool.owner();
    const hasAccessControl = hasOwnable !== ethers.constants.AddressZero;
    
    auditResults.checks.push({
      name: "Access Control",
      status: hasAccessControl ? "PASS" : "FAIL",
      details: hasAccessControl ? "Ownable pattern implemented" : "Missing access control"
    });

    if (!hasAccessControl) {
      auditResults.vulnerabilities.push({
        severity: "HIGH",
        issue: "Missing access control",
        recommendation: "Implement proper access control mechanisms"
      });
    }

    // Check 3: Input Validation
    console.log("3. Checking input validation...");
    try {
      await poolFactory.createPool(
        "", // Empty name
        ethers.utils.parseEther("0.01"),
        1, 10, 20, 0,
        { value: ethers.utils.parseEther("0.1") }
      );
      auditResults.checks.push({
        name: "Input Validation",
        status: "FAIL",
        details: "Empty name accepted"
      });
    } catch (error) {
      if (error.message.includes("Invalid")) {
        auditResults.checks.push({
          name: "Input Validation",
          status: "PASS",
          details: "Input validation working correctly"
        });
      }
    }

    // Check 4: Integer Overflow Protection
    console.log("4. Checking integer overflow protection...");
    const hasSafeMath = sourceCode.includes("SafeMath") || sourceCode.includes("unchecked");
    
    auditResults.checks.push({
      name: "Integer Overflow Protection",
      status: hasSafeMath ? "PASS" : "WARN",
      details: hasSafeMath ? "SafeMath or unchecked blocks used" : "Consider using SafeMath for arithmetic operations"
    });

    if (!hasSafeMath) {
      auditResults.recommendations.push({
        priority: "MEDIUM",
        recommendation: "Use SafeMath or Solidity 0.8+ for arithmetic operations"
      });
    }

    // Check 5: Event Emission
    console.log("5. Checking event emission...");
    const hasEvents = sourceCode.includes("event");
    
    auditResults.checks.push({
      name: "Event Emission",
      status: hasEvents ? "PASS" : "WARN",
      details: hasEvents ? "Events properly defined" : "Consider adding more events for transparency"
    });

    // Check 6: Gas Optimization
    console.log("6. Checking gas optimization...");
    const createPoolTx = await poolFactory.createPool(
      "Gas Test Pool",
      ethers.utils.parseEther("0.01"),
      1, 10, 20, 0,
      { value: ethers.utils.parseEther("0.1") }
    );
    const receipt = await createPoolTx.wait();
    
    const gasUsed = receipt.gasUsed;
    const isGasOptimized = gasUsed.lt(500000); // Less than 500k gas
    
    auditResults.checks.push({
      name: "Gas Optimization",
      status: isGasOptimized ? "PASS" : "WARN",
      details: `Gas used: ${gasUsed.toString()}, ${isGasOptimized ? 'Optimized' : 'Consider optimization'}`
    });

    if (!isGasOptimized) {
      auditResults.recommendations.push({
        priority: "LOW",
        recommendation: "Consider gas optimization techniques"
      });
    }

    // Check 7: External Dependencies
    console.log("7. Checking external dependencies...");
    const hasChainlink = sourceCode.includes("VRFConsumerBaseV2");
    
    auditResults.checks.push({
      name: "External Dependencies",
      status: hasChainlink ? "PASS" : "WARN",
      details: hasChainlink ? "Chainlink VRF properly integrated" : "Verify external dependency integration"
    });

    // Generate Report
    console.log("\n=== Security Audit Report ===");
    console.log("Timestamp:", auditResults.timestamp);
    console.log("\nChecks:");
    auditResults.checks.forEach(check => {
      console.log(`- ${check.name}: ${check.status} - ${check.details}`);
    });

    if (auditResults.vulnerabilities.length > 0) {
      console.log("\nVulnerabilities:");
      auditResults.vulnerabilities.forEach(vuln => {
        console.log(`- [${vuln.severity}] ${vuln.issue}`);
        console.log(`  Recommendation: ${vuln.recommendation}`);
      });
    }

    if (auditResults.recommendations.length > 0) {
      console.log("\nRecommendations:");
      auditResults.recommendations.forEach(rec => {
        console.log(`- [${rec.priority}] ${rec.recommendation}`);
      });
    }

    // Save results
    const fs = require('fs');
    fs.writeFileSync('security-audit-report.json', JSON.stringify(auditResults, null, 2));
    console.log("\nAudit report saved to security-audit-report.json");

    // Overall assessment
    const criticalIssues = auditResults.vulnerabilities.filter(v => v.severity === 'HIGH').length;
    const highIssues = auditResults.vulnerabilities.filter(v => v.severity === 'HIGH').length;
    const mediumIssues = auditResults.vulnerabilities.filter(v => v.severity === 'MEDIUM').length;

    if (criticalIssues > 0) {
      console.log("\n❌ AUDIT FAILED: Critical issues found");
      process.exit(1);
    } else if (highIssues > 0) {
      console.log("\n⚠️  AUDIT WARNING: High priority issues found");
    } else {
      console.log("\n✅ AUDIT PASSED: No critical issues found");
    }

  } catch (error) {
    console.error("Audit failed with error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
