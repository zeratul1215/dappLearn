import {deployments, ethers, getNamedAccounts} from "hardhat";
import type {Contract} from "ethers";
import {assert, expect} from "chai";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

describe("FundMe", () => {

  let fundMe: Contract;
  let mockV3Aggregator: Contract;
  const sendValue = ethers.parseEther("1"); //1 ETH
  let deployer: string;

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    const fundMeAddress = (await deployments.get("FundMe")).address;
    fundMe = await ethers.getContractAt("FundMe", fundMeAddress);
    const mockV3AggregatorAddress = (await deployments.get("MockV3Aggregator")).address;
    mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", mockV3AggregatorAddress);
  
  });

  describe("constructor", () => { 
    it("sets the aggregator address correctly", async () => {
      const response = await fundMe.s_priceFeed();
      const mockV3AggregatorAddress = await mockV3Aggregator.getAddress();
      assert.equal(response, mockV3AggregatorAddress);
    });
  });
 
  describe("fund", () => {
    it("Fails if you dont pay enough", async () => {
      await expect(fundMe.fund()).to.be.rejectedWith("You need to spend more ETH!");
    });

    it("updated the amount funded data structure", async () => {
      await fundMe.fund({value: sendValue});
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(),sendValue.toString());
    });

    it("adds a funder to the array of funders", async () => {
      await fundMe.fund({value: sendValue});
      const response = await fundMe.funders(0);
      assert.equal(response, deployer);
    });
  });

  describe("withdraw", () => {
    beforeEach(async () => {
      await fundMe.fund({value: sendValue});
    });

    it("withdraw ETH from a single funder", async () => {
      //arrange
      const startingFunds = await ethers.provider.getBalance(deployer);
      const startingFundsContract = await ethers.provider.getBalance(fundMe.target);
      // console.log("startingFunds: ", startingFunds);
      // console.log("startingFundsContract: ", startingFundsContract);
      
      //act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      
      // 计算实际消耗的 gas cost
      const gasUsed = transactionReceipt.gasUsed;
      const gasPrice = transactionReceipt.gasPrice;
      const gasCost = gasUsed * gasPrice;
      
      // console.log("gasCost: ", gasCost);
      // console.log("gasCost type: ", typeof gasCost);

      const endingFunds = await ethers.provider.getBalance(deployer);
      const endingFundsContract = await ethers.provider.getBalance(fundMe.target);
      
      //assert
      // console.log(endingFunds + BigInt(gasCost));
      // console.log(startingFunds + startingFundsContract);
      assert.equal((endingFunds + BigInt(gasCost)).toString(), (startingFunds + startingFundsContract).toString());

      assert.equal(endingFundsContract.toString(), "0");
      
    });
  });
});