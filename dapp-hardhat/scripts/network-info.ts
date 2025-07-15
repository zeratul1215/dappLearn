import { ethers } from "hardhat";

async function main() {
  console.log("=== 网络信息 ===");
  
  // 获取当前网络信息
  const network = await ethers.provider.getNetwork();
  console.log("当前网络 ChainId:", network.chainId);
  console.log("当前网络名称:", network.name);
  
  // 获取当前区块号
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log("当前区块号:", blockNumber);
  
  console.log("\n=== Signer 信息 ===");
  
  // 获取所有 signer
  const signers = await ethers.getSigners();
  console.log("Signer 数量:", signers.length);
  
  // 显示前 3 个 signer 的信息
  for (let i = 0; i < Math.min(3, signers.length); i++) {
    const signer = signers[i];
    const address = await signer.getAddress();
    const balance = await ethers.provider.getBalance(address);
    
    console.log(`\nSigner ${i}:`);
    console.log("  地址:", address);
    console.log("  余额:", ethers.formatEther(balance), "ETH");
  }
  
  console.log("\n=== Provider 信息 ===");
  console.log("Provider 类型:", ethers.provider.constructor.name);
  
  // 获取 gas 价格
  const feeData = await ethers.provider.getFeeData();
  console.log("当前 Gas 价格:", ethers.formatUnits(feeData.gasPrice || 0, "gwei"), "gwei");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 