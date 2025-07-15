import { ethers } from "hardhat";
// import type { Contract } from "ethers";

const main = async () => {
  const fundMeAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const balance = await ethers.provider.getBalance(fundMeAddress);
  console.log(balance);
  const signers = await ethers.getSigners();
  const balanceSignerZero = await ethers.provider.getBalance(signers[0].address);
  console.log(balanceSignerZero);
  const balanceSignerOne = await ethers.provider.getBalance(signers[1].address);
  console.log(balanceSignerOne);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});