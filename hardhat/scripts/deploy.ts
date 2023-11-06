import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import { ethers } from "hardhat";

async function main() {

  const etherspotNFTContract = await ethers.getContractFactory("EtherspotNFT");

  const deployedEtherspotNFTContract = await etherspotNFTContract.deploy();

  console.log(
    "Etherspot NFT Contract Address:",
    deployedEtherspotNFTContract.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });