import { ethers } from "hardhat";
import SimpleStorageArtifact from "../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json";

async function main() {
  // const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  const contractAddr = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
  
  const signers = await ethers.getSigners();
  const contract = new ethers.Contract(contractAddr,SimpleStorageArtifact.abi, signers[0]);

  const currentValue = await contract.retrieve();
  console.log(`Current Value is: ${currentValue}`);


  const transaction = await contract.store(7);
  await transaction.wait(1);

  const updatedValue = await contract.retrieve();
  console.log(`Updated Value is: ${updatedValue}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});