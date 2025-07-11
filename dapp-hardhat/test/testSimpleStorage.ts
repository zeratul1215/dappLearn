import { ethers } from "hardhat";
import { assert } from "chai";

describe("SimpleStorage", () => {
  let simpleStorageFactory: any;
  let simpleStorage: any;

  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy("SimpleStorage");
    // await simpleStorage.deployed();
  });

  it("Should start with a number of 0", async () => {
    const currentValue = await simpleStorage.retrieve(); 
    const expectedValue = "0";
    assert.equal(currentValue.toString(), expectedValue);
  });
});