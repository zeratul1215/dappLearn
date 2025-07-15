import {HardhatRuntimeEnvironment} from "hardhat/types";
import {developmentChains, networkConfig} from "../helper-hardhat-config";
import { verify } from "../utils/verify";

module.exports = async ({getNamedAccounts, deployments, network}: HardhatRuntimeEnvironment) => { // pulls the parameters from hre
  const {deploy, log, get} = deployments;
  const {deployer} = await getNamedAccounts();
  const chainId = network.config.chainId;


  //if chainId is a, use ...
  //if chainId is b, use ...

  let ethUsdPriceFeedAddress;

  if(developmentChains.includes(network.name)){
    const ethUsdAggregator = await get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  }
  else{
    ethUsdPriceFeedAddress = networkConfig[chainId! as keyof typeof networkConfig]["ethUsdPriceFeed"];
  }

  const args = [ethUsdPriceFeedAddress];
  // when going for localhost or hardhat network we want to use the mock
  let fundMe;
  if(developmentChains.includes(network.name)){
    fundMe = await deploy("FundMe", {
      from: deployer,
      args: args,
      log: true,
    });
  }
  else{
    fundMe = await deploy("FundMe", {
      from: deployer,
      args: args, // put price feed address here
      log: true,
      waitConfirmations: 6,
    });
  }

  log("FundMe deployed to: ", fundMe.address);

  if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
    await verify(fundMe.address, args);
  }
}

module.exports.tags = ["all", "fundme"];