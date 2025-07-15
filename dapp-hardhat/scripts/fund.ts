import { ethers } from "hardhat";
import type { Contract } from "ethers";

const main = async () => {
  const fundMeAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const fundMe = await ethers.getContractAt("FundMe", fundMeAddress);
  console.log("Funding...");
  const signers = await ethers.getSigners();
  const connectSignerOneWithFundMe = await fundMe.connect(signers[1]) as Contract;
  const transactionResponse = await connectSignerOneWithFundMe.fund({value: ethers.parseEther("0.1")});
  await transactionResponse.wait(1);
  console.log("Funded!");
}
//0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});