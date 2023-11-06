import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'

require("dotenv").config({ path: ".env" });

const RPC = process.env.RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API = process.env.ETHERSCAN_API;

console.log(RPC)

module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: RPC,
      accounts: [PRIVATE_KEY],
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API,
 }
};
