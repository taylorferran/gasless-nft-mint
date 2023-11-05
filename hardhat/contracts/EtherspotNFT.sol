// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
    @title Gasless NFT mint for Etherspot
    @author Taylor Ferran
**/ 

import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./interfaces/IEtherspotNFT.sol";

/*  
@@@@@@@@@@@@&J7!?#@@@@@@@@@@@@@@#?!7J&@@@@@@@@@@@@
@@@@@@@@@@@@&?!!7B@@&#BGPPGB#&@@B7!!?&@@@@@@@@@@@@
@@@@@@@@@@@@@@##@@GY77!!!!!!7?YG@@##@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@G?!!!!!!!!!!!!!!?G@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@5!!!!!!!!!!!!!!!!!!5@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@B!!!!!!!!!!!!!!!!!!!!B@@@@@@@@@@@@@@
@@@@@@@@@@@@&#Y!!!!!!!!!!!!!!!!!!!!Y#&@@@@@@@@@@@@
@@@@@@@@@&GY7!!!!!!!!!!!!!!!!!!!!!!!!7YG&@@@@@@@@@
@@@@@@@#Y7!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!7Y#@@@@@@@
@@@@@#Y!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Y#@@@@@
@@@@57!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!7P@@@@
@@&J!!!!!!!!77!!!!!!!!!!YY!!!!!!!!!!77!!!!!!!!J&@@
@&?!!!!!!!JB&&P7!!!!!!!P@@P!!!!!!!7P&&BJ!!!!!!!?&@
@Y!!!!!!!!Y@@@#7!!!!!7B@@@@B7!!!!!7#@@@Y!!!!!!!!Y@
G!!!!!!!!!!?JJ7!!!!!J#@@##@@#J!!!!!7JJ?!!!!!!!!!!G
J!!!!!!!!!!!!!!!!!!5@@@G77G@@@5!!!!!!!!!!!!!!!!!!J
7!!!!JPPY7!!!!!!!7G@@@5!!!!5@@@G7!!!!!!!7YPPJ!!!!7
!!!!?@@@@Y!!!!!!?#@@&J!!!!!!J&@@#?!!!!!!J@@@@J!!!7
?!!!7YGG57!!!!!Y&@@B?!!!!!!!!?B@@&J!!!!!75GGY7!!!?
5!!!!!!!!!!!!!P@@@P7!!!!!!!!!!!P@@@5!!!!!!!!!!!!!5
&?!!!!!!!!!!7B@@&Y!!!!!!!!!!!!!!Y&@@B7!!!!!!!!!!?&
@B7!!!!!!!!J#@@#?!!!!!!!!!!!!!!!!?#@@#J!!!!!!!!7B@
@@G7!!!!!!5@@@@P?7!!!!!!!!!!!!!!7?P@@@@Y!!!!!!7B@@
@@@#?!!!7G@@@@@@@&GY?!!!!!!!!?YG&@@@@@@@P7!!!?#@@@
@@@@@57?#@@@@@@#G#@@@#PJ77JP#@@@#G#@@@@@@B?7P@@@@@
@@@@@@#&@@@@@@@@&5?YG&@@&&@@&GY?5&@@@@@@@@&#@@@@@@
@@@@@@@@@@@@@@@@@@#J!7JP##PJ7!JB@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@G?!!!!!!?G@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@&P7!!75&@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@#JJ#@@@@@@@@@@@@@@@@@@@@@@@
*/

contract EtherspotNFT is ERC1155, Ownable {

    // Count of how many users have minted rewards
    uint248 public numberOfTokensMinted;
    // Flag to stop/start minting
    bool public mintActive = false;

    modifier IsMintActive() {
        if(!mintActive)
            revert MintPaused();
        _;
    }

    /// @dev Change ipfs link to the one we want // "https://ipfs.io/ipfs/QmVCPmxzCR4rB636Ghh5PqXfy56XNJ6NGY5oHr6Hjeso8X/{id}.json"
    constructor(string memory _ipfsLink) ERC1155(_ipfsLink) Ownable(msg.sender){
        
    }

    /// @param _targetAddress Wallet address to mint 
    function mint(address _targetAddress) external payable IsMintActive {
        if( (this.balanceOf(_targetAddress, 1)) > 0)
        revert AddressAlreadyHasNFT();
        numberOfTokensMinted++;
        _mint(_targetAddress, 1, 1, "");
    }

    /// @dev For turning the mint on/off
    /// @param _mintActive if mintActive == true, users can mint
    function setMintActive(bool _mintActive) public onlyOwner {
        mintActive = _mintActive;
    }

    /// @dev Withdraw function if funds are sent here by accident
	function withdraw(address _targetAddress) public onlyOwner {
		(bool sent, ) =  _targetAddress.call{value: address(this).balance}("");
		require(sent, "Failed to send Ether");
	}
}
