import { useState } from 'react';
import {
  EtherspotBatch,
  EtherspotBatches,
  EtherspotContractTransaction,
  useEtherspotTransactions,
  useWalletAddress,
} from '@etherspot/transaction-kit';

import logo from './etherspot-logo.svg';
import './App.css';
import { utils } from 'ethers';

function App() {
  const etherspotAddress = useWalletAddress();
  const { estimate, send } = useEtherspotTransactions();
  const [mintAddress, setMintAddress] = useState(
    '0x8cE200CECa9753aaE27C18f613C707A551313927'
  );

  console.log("etherspotAddress: ", etherspotAddress)
  console.log("mintAddress: ",mintAddress);


  const [latestEstimationData, setLatestEstimationData] = useState(null);
  const [latestSendData, setLatestSendData] = useState(null);

  const whitelistAddressAndMintNFT = async () => {

    const addresses = [etherspotAddress];
    const api_key = 'gasless_mint_demo';
    const chainId = 80001;
    const returnedValue = await fetch('https://arka.etherspot.io/whitelist', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "params": [addresses, chainId, api_key] })
    })
      .then((res) => {
        return res.json()
      }).catch((err) => {
        console.log(err);
      });

	  console.log('Value returned: ', returnedValue);

    console.log('mintAddress', mintAddress);

    await estimate();
    const sendResult = await send();
    console.log('Send Data:', sendResult);

    if (JSON.stringify(sendResult).includes('reverted')) {
      alert(
        'There was a problem trying to send your transaction. This can happen for a variety of reasons, but the most common problems are bad blockchain conditions or an out of date estimate.\n\nPlease try to send it again.'
      );
      return;
    }

    setLatestSendData(sendResult);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <EtherspotBatches
          paymaster={{
            url: "https://arka.etherspot.io",
            api_key: "gasless_mint_demo",
            context: { mode: "sponsor" }
          }}
        >
          <EtherspotBatch chainId={80001}>
            <EtherspotContractTransaction 
            contractAddress={'0x09C84f517E3Ff7347b2902b3055Bb4ac90745f3b'}
            abi={['function mint(address)']}
            methodName={'mint'}
            // REPLACE_HERE
            params={[mintAddress]}
            value={'0'} 
            >

              <div className="App-form-control">
                <label className="App-label" htmlFor="addressInput">
                 Address on Mumbai to mint NFT:
                </label>
                <input
                  className="App-text-input"
                  id="addressInput"
                  type="text"
                  value={mintAddress}
                  onChange={e => setMintAddress(e.target.value)}
                />
              </div>

              {!!latestEstimationData && !latestSendData && (
                <p className="App-transaction-details">
                  Estimated transaction cost:
                  <br />
                  <strong>
                    Test MATIC{' '}
                    {utils.formatEther(
                      latestEstimationData[0].estimatedBatches[0].cost
                    )}
                  </strong>
                </p>
              )}

              {!!latestSendData && (
                <p className="App-transaction-details">
                  <strong>Your transaction was sent!</strong>
                  <br />
                  Your transaction will soon appear{' '}
                  <a
                    target="_blank"
                    href={`https://mumbai.polygonscan.com/address/${mintAddress}#nfttransfers`}
                  >
                    here
                  </a>
                  !
                </p>
              )}

              <div className="App-form-buttons-control">
                <button onClick={whitelistAddressAndMintNFT} color="success">
                  Mint NFT
                </button>
              </div>
            </EtherspotContractTransaction>
          </EtherspotBatch>
        </EtherspotBatches>
      </header>
    </div>
  );
}

export default App;
