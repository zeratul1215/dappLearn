import {HardhatRuntimeEnvironment} from "hardhat/types";
import {developmentChains, DECIMALS, INITIAL_ANSWER} from "../helper-hardhat-config";

module.exports = async ({getNamedAccounts, deployments, network}: HardhatRuntimeEnvironment) => { // pulls the parameters from hre
  const {deploy, log} = deployments;
  const {deployer} = await getNamedAccounts();
  // const chainId = network.config.chainId;
  
  if(developmentChains.includes(network.name)){
  // if(chainId === 31337){
    log("local network detected, deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocks deployed!");
  }
}

module.exports.tags = ["all", "mocks"];