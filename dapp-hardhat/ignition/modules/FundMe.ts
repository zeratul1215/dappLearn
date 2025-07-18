import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { network } from "hardhat";
import {developmentChains, DECIMALS, INITIAL_ANSWER, networkConfig} from "../../helper-hardhat-config";

const FundMeModule = buildModule("FundMe", (m) => {
  let aggregator;
  if(developmentChains.includes(network.name)){
    aggregator = m.contract("MockV3Aggregator", [DECIMALS, INITIAL_ANSWER]);
  } else {
    aggregator = m.contractAt("AggregatorV3Interface", networkConfig[network.config.chainId as keyof typeof networkConfig].ethUsdPriceFeed);
  }

  const fundMe = m.contract("FundMe", [aggregator]);

  return {
    fundMe
  };
});

export default FundMeModule;
