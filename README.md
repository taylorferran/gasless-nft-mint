## Gasless NFT mint

>[!Warning]
>This repo is unfinished (frontend still need completed).
>


Here I'm using Etherspot's 4337 infrastructure to create a gasless NFT mint on Mumbai.

We're using Ethers to create a random EOA on page load, and Transaction Kit to create 
a Etherspot smart contract account and sign the transaction, and Arka paymaster to sponsor the transaction.
