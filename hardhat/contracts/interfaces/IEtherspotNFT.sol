// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

error MintPaused();
error AddressAlreadyHasNFT();
error PasswordIncorrect();
error SignatoryAlreadyAdded();
error NumberOfSignaturesTooHigh();
error SignatoryIncorrectAccessLevel();
error TransactionNotSigned();
error TransactionSigned();
error TransactionInactive();
error NotEnoughETH();
error IncorrectPasswordLength();

interface IEtherspotNFT {
}